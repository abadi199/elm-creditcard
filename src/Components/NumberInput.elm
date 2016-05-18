module Components.NumberInput exposing (numberInput, Msg, update)

import Html exposing (Attribute, Html, input)
import Html.Events exposing (onWithOptions, keyCode, onInput)
import Html.App as Html
import Html.Attributes exposing (value)
import Char exposing (fromCode, KeyCode)
import String exposing (fromChar, slice)
import Json.Decode as Json


type alias Model =
    String


allowedKeyCodes : List Int
allowedKeyCodes =
    [ 37, 39, 8, 17, 18, 46, 9, 13 ]


onKeyDown : Maybe Int -> Model -> (Int -> msg) -> Attribute msg
onKeyDown maxLength model tagger =
    let
        options =
            { stopPropagation = False
            , preventDefault = True
            }

        exceedMaxLength =
            maxLength
                |> Maybe.map ((<) (String.length model))
                |> Maybe.withDefault True

        isNotNumeric =
            (\k ->
                if List.any ((==) k) allowedKeyCodes then
                    Err "not arrow"
                else if k >= 48 && k <= 57 && exceedMaxLength then
                    Err "numeric"
                else
                    Ok k
            )

        decoder =
            isNotNumeric
                |> Json.customDecoder keyCode
                |> Json.map tagger
    in
        onWithOptions "keydown" options decoder


numberInput : Maybe Int -> (String -> String) -> List (Attribute Msg) -> Model -> Html Msg
numberInput maxLength formatter attributes model =
    let
        tagger keyCode =
            if keyCode >= 48 && keyCode <= 57 then
                KeyDown keyCode
            else
                NoOp
    in
        input (List.append attributes [ value (formatter model), onKeyDown maxLength model tagger, onInput OnInput ])
            []


update : Msg -> Model -> String
update msg model =
    case msg of
        NoOp ->
            model

        KeyDown _ ->
            model

        OnInput newValue ->
            newValue


type Msg
    = NoOp
    | KeyDown KeyCode
    | OnInput String


main : Program Never
main =
    Html.beginnerProgram { model = "", update = update, view = numberInput (Just 5) identity [] }

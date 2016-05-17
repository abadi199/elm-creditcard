module NumberInput exposing (numberInput, Msg, update)

import Html exposing (Attribute, Html, input)
import Html.Events exposing (onWithOptions, keyCode, onInput)
import Html.App as Html
import Html.Attributes exposing (value)
import Char exposing (fromCode, KeyCode)
import String exposing (fromChar, slice)
import Json.Decode as Json


type alias Model =
    String


onKeyDown : Model -> (Int -> msg) -> Attribute msg
onKeyDown model tagger =
    let
        isNotNumeric =
            (\k ->
                if Debug.log "" k == 37 || k == 39 || k == 8 || k == 17 || k == 18 || k == 46 then
                    Err "not arrow"
                else if k >= 48 && k <= 57 && String.length model < 16 then
                    Err "numeric"
                else
                    Ok k
            )
    in
        onWithOptions "keydown"
            { stopPropagation = False
            , preventDefault = True
            }
            (Json.map tagger (Json.customDecoder keyCode isNotNumeric))


numberInput : Model -> Html Msg
numberInput model =
    let
        tagger keyCode =
            if Debug.log "" keyCode >= 48 && keyCode <= 57 then
                KeyDown keyCode
            else
                NoOp
    in
        input [ value model, onKeyDown model tagger, onInput OnInput ]
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
    Html.beginnerProgram { model = "", update = update, view = numberInput }

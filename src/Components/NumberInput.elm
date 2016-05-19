module Components.NumberInput exposing (numberInput, Msg, update, Options)

import Html exposing (Attribute, Html, input)
import Html.Events exposing (onWithOptions, keyCode, onInput)
import Html.App as Html
import Html.Attributes exposing (value)
import Char exposing (fromCode, KeyCode)
import String exposing (fromChar, slice)
import Json.Decode as Json exposing ((:=))


type alias Options =
    { maxLength : Maybe Int
    , maxValue : Maybe Int
    , minValue : Maybe Int
    }


type alias Model =
    String


type alias Event =
    { keyCode : Int
    , ctrlKey : Bool
    , altKey : Bool
    }


allowedKeyCodes : List Int
allowedKeyCodes =
    [ 37, 39, 8, 17, 18, 46, 9, 13 ]


onKeyDown : Options -> Model -> (Int -> msg) -> Attribute msg
onKeyDown options model tagger =
    let
        eventDecoder =
            Json.object3 Event
                ("keyCode" := Json.int)
                ("ctrlKey" := Json.bool)
                ("altKey" := Json.bool)

        eventOptions =
            { stopPropagation = False
            , preventDefault = True
            }

        updatedNumber keyCode =
            keyCode
                |> Char.fromCode
                |> String.fromChar
                |> (++) model
                |> String.toInt
                |> Result.toMaybe

        exceedMaxValue keyCode =
            keyCode
                |> updatedNumber
                |> Maybe.map2 (\max number -> number > max) options.maxValue
                |> Maybe.withDefault False

        lessThanMinValue keyCode =
            keyCode
                |> updatedNumber
                |> Maybe.map2 (\min number -> number < min) options.minValue
                |> Maybe.withDefault False

        exceedMaxLength =
            options.maxLength
                |> Maybe.map ((>=) (String.length model))
                |> Maybe.withDefault True

        isNotNumeric =
            (\event ->
                if event.ctrlKey || event.altKey then
                    Err "modifier key is pressed"
                else if List.any ((==) event.keyCode) allowedKeyCodes then
                    Err "not arrow"
                else if
                    event.keyCode
                        >= 48
                        && event.keyCode
                        <= 57
                        && not exceedMaxLength
                        && not (exceedMaxValue event.keyCode)
                        && not (lessThanMinValue event.keyCode)
                then
                    Err "numeric"
                else
                    Ok event.keyCode
            )

        decoder =
            isNotNumeric
                |> Json.customDecoder eventDecoder
                |> Json.map tagger
    in
        onWithOptions "keydown" eventOptions decoder


numberInput : Options -> (String -> String) -> List (Attribute Msg) -> Model -> Html Msg
numberInput options formatter attributes model =
    let
        tagger keyCode =
            if keyCode >= 48 && keyCode <= 57 then
                KeyDown keyCode
            else
                NoOp
    in
        input (List.append attributes [ value (formatter model), onKeyDown options model tagger, onInput OnInput ])
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
    Html.beginnerProgram
        { model = ""
        , update = update
        , view =
            numberInput { maxLength = Just 5, maxValue = Just 12, minValue = Just 1 }
                identity
                []
        }

module CreditCard.Components.NumberInput exposing (Model, numberInput, Msg, update, Options)

import Html exposing (Attribute, Html, input)
import Html.Events exposing (onWithOptions, keyCode, onInput, onFocus, onBlur)
import Html.App as Html
import Html.Attributes as Attributes exposing (value)
import Char exposing (fromCode, KeyCode)
import String exposing (fromChar, slice)
import Json.Decode as Json exposing ((:=))


type alias Options =
    { maxLength : Maybe Int
    , maxValue : Maybe Int
    , minValue : Maybe Int
    }


type alias Model =
    { value : String
    , hasFocus : Bool
    }


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
                |> (++) model.value
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
                |> Maybe.map ((>=) (String.length model.value))
                |> Maybe.withDefault True

        isNumPad keyCode =
            keyCode
                >= 96
                && keyCode
                <= 105

        isNumber keyCode =
            keyCode
                >= 48
                && keyCode
                <= 57

        filterKey =
            (\event ->
                if event.ctrlKey || event.altKey then
                    Err "modifier key is pressed"
                else if List.any ((==) event.keyCode) allowedKeyCodes then
                    Err "not arrow"
                else if
                    (isNumber event.keyCode || isNumPad event.keyCode)
                        && not exceedMaxLength
                        && not (exceedMaxValue event.keyCode)
                        && not (lessThanMinValue event.keyCode)
                then
                    Err "numeric"
                else
                    Ok event.keyCode
            )

        decoder =
            filterKey
                |> Json.customDecoder eventDecoder
                |> Json.map tagger
    in
        onWithOptions "keydown" eventOptions decoder


numberInput : String -> Options -> (String -> String) -> List (Attribute Msg) -> Model -> Html Msg
numberInput id options formatter attributes model =
    let
        tagger keyCode =
            if keyCode >= 48 && keyCode <= 57 then
                KeyDown keyCode
            else
                NoOp
    in
        input
            (List.append attributes
                [ Attributes.id id
                , value (formatter model.value)
                , onKeyDown options model tagger
                , onInput OnInput
                , onFocus (OnFocus True)
                , onBlur (OnFocus False)
                ]
            )
            []


update : Msg -> Model -> Model
update msg model =
    case msg of
        NoOp ->
            model

        KeyDown _ ->
            model

        OnInput newValue ->
            { model | value = newValue }

        OnFocus hasFocus ->
            { model | hasFocus = hasFocus }


type Msg
    = NoOp
    | KeyDown KeyCode
    | OnInput String
    | OnFocus Bool


main : Program Never
main =
    Html.beginnerProgram
        { model = { value = "", hasFocus = False }
        , update = update
        , view =
            numberInput "NumberInput"
                { maxLength = Just 5, maxValue = Just 12, minValue = Just 1 }
                identity
                []
        }

module CreditCard.Components.StringInput exposing (Model, stringInput, Msg, update)

import Html exposing (Attribute, Html, input)
import Html.Events exposing (onWithOptions, keyCode, onInput, onFocus, onBlur)
import Html.Attributes as Attributes exposing (value)
import Char exposing (fromCode, KeyCode)


type alias Model =
    { value : String
    , hasFocus : Bool
    }


stringInput : String -> List (Attribute Msg) -> Model -> Html Msg
stringInput id attributes model =
    input
        (List.append attributes
            [ Attributes.id id
            , value model.value
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

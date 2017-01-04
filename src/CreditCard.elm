module CreditCard exposing (card, State, initialState, CardData, form)

{-|
# View
@docs card,  form

# Data
@docs CardData

# Internal State
@docs State, initialState
-}

import CreditCard.Components.Card
import CreditCard.Config exposing (Config, FormConfig, Updaters)
import CreditCard.Internal
import CreditCard.Events exposing (onCCVFocus, onCCVBlur)
import Helpers.CardType
import Helpers.Misc
import Html exposing (Html, div, label, p, text, input)
import Html.Attributes exposing (class, type_, value, placeholder)
import Html.Events exposing (onInput)
import Input.BigNumber
import Input.Number
import String


{-| Internal State of the card view
-}
type alias State =
    CreditCard.Internal.State


{-| Initial state of the card view
-}
initialState : State
initialState =
    CreditCard.Internal.initialState



-- VIEW


{-| Card Data
-}
type alias CardData model =
    { model
        | number : Maybe String
        , name : Maybe String
        , month : Maybe String
        , year : Maybe String
        , ccv : Maybe String
        , state : State
    }


{-| Card view
-}
card : Config {} -> CardData model -> Html msg
card config cardData =
    let
        cardInfo =
            Helpers.CardType.detect cardData
    in
        CreditCard.Components.Card.card config cardInfo cardData


{-| Form view
-}
form : Config (FormConfig (Updaters msg)) -> CardData model -> Html msg
form config cardData =
    let
        cardInfo =
            Helpers.CardType.detect cardData

        ( _, maxLength ) =
            Helpers.Misc.minMaxNumberLength cardInfo

        unwrap : (Maybe String -> msg) -> (String -> msg)
        unwrap msg =
            (\str -> msg <| Just str)

        toMaybeInt : (Maybe String -> msg) -> (Maybe Int -> msg)
        toMaybeInt msg =
            (\maybeInt -> msg <| Maybe.map toString maybeInt)

        field getter inputElement =
            p [ class <| getter config.classes ]
                [ label [] [ text <| getter config.labels, inputElement ]
                ]

        numberConfig =
            let
                default =
                    Input.BigNumber.defaultOptions <| unwrap config.updateNumber
            in
                { default | maxLength = Just maxLength }

        monthConfig =
            let
                default =
                    Input.Number.defaultOptions <| toMaybeInt config.updateMonth
            in
                { default | maxValue = Just 12, minValue = Just 1 }

        yearConfig =
            let
                default =
                    Input.Number.defaultOptions <| toMaybeInt config.updateYear
            in
                { default | minValue = Just 1, maxValue = Just 9999 }

        focusHandler hasFocus =
            let
                updatedCardData =
                    CreditCard.Events.updateCCVFocus hasFocus cardData
            in
                config.updateState updatedCardData.state

        ccvConfig =
            let
                default =
                    Input.Number.defaultOptions <| toMaybeInt config.updateCCV
            in
                { default | minValue = Just 1, maxValue = Just 9999, hasFocus = Just focusHandler }
    in
        div []
            [ CreditCard.Components.Card.card config cardInfo cardData
            , field .number <| Input.BigNumber.input numberConfig [ placeholder config.placeholders.number ] (Maybe.withDefault "" cardData.number)
            , field .name <| input [ type_ "text", value <| Maybe.withDefault "" cardData.name, onInput (Just >> config.updateName), placeholder config.placeholders.name ] []
            , field .month <| Input.Number.input monthConfig [ placeholder config.placeholders.month ] (cardData.month |> Maybe.andThen (String.toInt >> Result.toMaybe))
            , field .year <| Input.Number.input yearConfig [ placeholder config.placeholders.year ] (cardData.year |> Maybe.andThen (String.toInt >> Result.toMaybe))
            , field .ccv <| Input.Number.input ccvConfig [ placeholder config.placeholders.ccv ] (cardData.ccv |> Maybe.andThen (String.toInt >> Result.toMaybe))
            ]

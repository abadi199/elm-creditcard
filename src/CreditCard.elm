module CreditCard
    exposing
        ( card
        , State
        , initialState
        , CardData
        , form
        , emptyCardData
        )

{-|
# View
@docs card,  form

# Data
@docs CardData, emptyCardData

# Internal State
@docs State, initialState
-}

import CreditCard.Components.Card
import CreditCard.Config exposing (Config, FormConfig)
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


{-| Empty card data
-}
emptyCardData : CardData {}
emptyCardData =
    { number = Nothing
    , name = Nothing
    , month = Nothing
    , year = Nothing
    , ccv = Nothing
    , state = initialState
    }



-- VIEW


{-| Stores the card data such as number, name, etc.

This `CardData` can be embeded into your application's Model in various ways.
Here's 2 example of embedding this data into your model:
Example 1:

    -- Use CardData in your model directly
    type alias Model =
        { cardData : CreditCard.CardData {}
        ...
        }

    -- Initial the model
    init =
        { cardData = CardData.emptyCardData
        ...
        }

Example 2:

    -- Extends the CardData in your Model
    type alias Model =
        { number : Maybe String
        , name : Maybe String
        , month : Maybe String
        , year : Maybe String
        , ccv : Maybe String
        , state : CreditCard.State
        , shippingAddress : Maybe String
        ...
        }

    -- Initial the model
    init =
        let
            emptyCardData =
                CardData.emptyCardData
        in
            { emptyCardData |
            shippingAddress = Nothing
            ...
            }
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
form : FormConfig model msg -> CardData model -> Html msg
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
                [ if config.showLabel then
                    label [] [ text <| getter config.labels, inputElement ]
                  else
                    inputElement
                ]

        numberConfig =
            let
                default =
                    Input.BigNumber.defaultOptions <| updateNumber config cardData
            in
                { default | maxLength = Just maxLength }

        monthConfig =
            let
                default =
                    Input.Number.defaultOptions <| updateMonth config cardData
            in
                { default | maxValue = Just 12, minValue = Just 1 }

        yearConfig =
            let
                default =
                    Input.Number.defaultOptions <| updateYear config cardData
            in
                { default | minValue = Just 1, maxValue = Just 9999 }

        focusHandler hasFocus =
            let
                updatedCardData =
                    CreditCard.Events.updateCCVFocus hasFocus cardData
            in
                config.onChange updatedCardData

        ccvConfig =
            let
                default =
                    Input.Number.defaultOptions <| updateCCV config cardData
            in
                { default | minValue = Just 1, maxValue = Just 9999, hasFocus = Just focusHandler }
    in
        div []
            [ CreditCard.Components.Card.card config cardInfo cardData
            , field .number <| Input.BigNumber.input numberConfig [ placeholder config.placeholders.number ] (Maybe.withDefault "" cardData.number)
            , field .name <| input [ type_ "text", value <| Maybe.withDefault "" cardData.name, onInput <| updateName config cardData, placeholder config.placeholders.name ] []
            , field .month <| Input.Number.input monthConfig [ placeholder config.placeholders.month ] (cardData.month |> Maybe.andThen (String.toInt >> Result.toMaybe))
            , field .year <| Input.Number.input yearConfig [ placeholder config.placeholders.year ] (cardData.year |> Maybe.andThen (String.toInt >> Result.toMaybe))
            , field .ccv <| Input.Number.input ccvConfig [ placeholder config.placeholders.ccv ] (cardData.ccv |> Maybe.andThen (String.toInt >> Result.toMaybe))
            ]


updateCCV : Config (FormConfig model msg) -> CardData model -> (Maybe Int -> msg)
updateCCV config cardData =
    let
        updatedCardData maybeInt =
            { cardData | ccv = Maybe.map toString maybeInt }
    in
        (\maybeInt -> config.onChange (updatedCardData maybeInt))


updateYear : Config (FormConfig model msg) -> CardData model -> (Maybe Int -> msg)
updateYear config cardData =
    let
        updatedCardData maybeInt =
            { cardData | year = Maybe.map toString maybeInt }
    in
        (\maybeInt -> config.onChange (updatedCardData maybeInt))


updateMonth : Config (FormConfig model msg) -> CardData model -> (Maybe Int -> msg)
updateMonth config cardData =
    let
        updatedCardData maybeInt =
            { cardData | month = Maybe.map toString maybeInt }
    in
        (\maybeInt -> config.onChange (updatedCardData maybeInt))


updateNumber : Config (FormConfig model msg) -> CardData model -> (String -> msg)
updateNumber config cardData =
    let
        updatedCardData number =
            { cardData | number = Just number }
    in
        (\number -> config.onChange (updatedCardData number))


updateName : Config (FormConfig model msg) -> CardData model -> (String -> msg)
updateName config cardData =
    let
        updatedCardData name =
            { cardData | name = Just name }
    in
        (\name -> config.onChange (updatedCardData name))

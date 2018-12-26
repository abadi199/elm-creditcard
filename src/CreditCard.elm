module CreditCard exposing
    ( card, form, number, name, month, year, cvv
    , CardData, emptyCardData
    , State, initialState
    )

{-|


# View

@docs card, form, number, name, month, year, cvv


# Data

@docs CardData, emptyCardData


# Internal State

@docs State, initialState

-}

import CreditCard.Components.Card
import CreditCard.Config exposing (Config, Form, FormConfig)
import CreditCard.Events exposing (onCVVBlur, onCVVFocus)
import CreditCard.Internal
import Helpers.CardType
import Helpers.Misc
import Html exposing (Html, div, input, label, p, text)
import Html.Attributes exposing (class, placeholder, type_, value)
import Html.Events exposing (onInput)
import Input.BigNumber
import Input.Number


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
    , cvv = Nothing
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
        , cvv : Maybe String
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
        , cvv : Maybe String
        , state : State
    }


{-| Card view

Render the card view individually.
Example:

    view model =
        let
            config =
                CreditCard.Config.defaultConfig
        in
        CreditCard.card config model

-}
card : Config config -> CardData model -> Html msg
card config cardData =
    let
        cardInfo =
            Helpers.CardType.detect cardData
    in
    CreditCard.Components.Card.card config cardInfo cardData


{-| Form view

Render the card view with the full form fields.
Example:

    type Msg
        = UpdateCardData Model

    view model =
        let
            config =
                CreditCard.Config.defaultFormConfig UpdateCardData
        in
        CreditCard.card config model

-}
form : FormConfig model msg -> CardData model -> Html msg
form config cardData =
    div []
        [ card config cardData
        , number config [] cardData
        , name config [] cardData
        , month config [] cardData
        , year config [] cardData
        , cvv config [] cardData
        ]


{-| CVV form field

Render the CVV field individually.
Example:

    type Msg = UpdateCardData Model

    view model =
        let
            config =
                CreditCard.Config.defaultFormConfig UpdateCardData
        in
            form []
                [ CreditCard.card config model
                , CreditCard.cvv config [] model
                ...

-}
cvv : FormConfig model msg -> List (Html.Attribute msg) -> CardData model -> Html msg
cvv config attributes cardData =
    let
        cvvConfig =
            let
                default =
                    Input.BigNumber.defaultOptions <| updateCVV config cardData
            in
            { default | maxLength = Just 4, hasFocus = Just focusHandler }

        focusHandler hasFocus =
            let
                updatedCardData =
                    CreditCard.Events.updateCVVFocus hasFocus cardData
            in
            config.onChange updatedCardData
    in
    field .cvv config <|
        Input.BigNumber.input cvvConfig
            (placeholder config.placeholders.cvv :: autocompleteAttributes config CVV ++ attributes)
        <|
            Maybe.withDefault "" cardData.cvv


{-| Year form field

Render the year field individually.
Example:

    type Msg = UpdateCardData Model

    view model =
        let
            config =
                CreditCard.Config.defaultFormConfig UpdateCardData
        in
            form []
                [ CreditCard.card config model
                , CreditCard.year config [] model
                ...

-}
year : FormConfig model msg -> List (Html.Attribute msg) -> CardData model -> Html msg
year config attributes cardData =
    let
        yearConfig =
            let
                default =
                    Input.BigNumber.defaultOptions <| updateYear config cardData
            in
            { default | maxLength = Just 4 }
    in
    field .year config <|
        Input.BigNumber.input yearConfig
            (placeholder config.placeholders.year :: autocompleteAttributes config Year ++ attributes)
        <|
            Maybe.withDefault "" cardData.year


{-| Month form field

Render the month field individually.
Example:

    type Msg = UpdateCardData Model

    view model =
        let
            config =
                CreditCard.Config.defaultFormConfig UpdateCardData
        in
            form []
                [ CreditCard.card config model
                , CreditCard.month config [] model
                ...

-}
month : FormConfig model msg -> List (Html.Attribute msg) -> CardData model -> Html msg
month config attributes cardData =
    let
        monthConfig =
            let
                default =
                    Input.Number.defaultStringOptions <| updateMonth config cardData
            in
            { default | maxLength = Just 2, maxValue = Just 12, minValue = Just 1 }
    in
    field .month config <|
        Input.Number.inputString monthConfig
            (placeholder config.placeholders.month :: autocompleteAttributes config Month ++ attributes)
        <|
            Maybe.withDefault "" cardData.month


{-| Name form field

Render the name field individually.
Example:

    type Msg = UpdateCardData Model

    view model =
        let
            config =
                CreditCard.Config.defaultFormConfig UpdateCardData
        in
            form []
                [ CreditCard.card config model
                , CreditCard.name config [] model
                ...

-}
name : FormConfig model msg -> List (Html.Attribute msg) -> CardData model -> Html msg
name config attributes cardData =
    field .name config <|
        input
            ([ type_ "text"
             , value <| Maybe.withDefault "" cardData.name
             , onInput <| updateName config cardData
             , placeholder config.placeholders.name
             ]
                ++ autocompleteAttributes config Name
                ++ attributes
            )
            []


{-| Number form field

Render the number field individually.
Example:

    type Msg = UpdateCardData Model

    view model =
        let
            config =
                CreditCard.Config.defaultFormConfig UpdateCardData
        in
            form []
                [ CreditCard.card config model
                , CreditCard.number config [] model
                ...

-}
number : FormConfig model msg -> List (Html.Attribute msg) -> CardData model -> Html msg
number config attributes cardData =
    let
        cardInfo =
            Helpers.CardType.detect cardData

        ( _, maxLength ) =
            Helpers.Misc.minMaxNumberLength cardInfo

        numberConfig =
            let
                default =
                    Input.BigNumber.defaultOptions <| updateNumber config cardData
            in
            { default | maxLength = Just maxLength }
    in
    field .number config <|
        Input.BigNumber.input numberConfig
            (placeholder config.placeholders.number :: autocompleteAttributes config Number ++ attributes)
            (Maybe.withDefault "" cardData.number)



-- HELPERS


field : (Form -> String) -> FormConfig model msg -> Html msg -> Html msg
field getter config inputElement =
    if config.showLabel then
        p [ class <| getter config.classes ]
            [ label [] [ text <| getter config.labels, inputElement ] ]

    else
        inputElement


updateCVV : Config (FormConfig model msg) -> CardData model -> (String -> msg)
updateCVV config cardData =
    let
        updatedCardData c =
            { cardData | cvv = Just c }
    in
    \a -> config.onChange (updatedCardData a)


updateYear : Config (FormConfig model msg) -> CardData model -> (String -> msg)
updateYear config cardData =
    let
        updatedCardData y =
            { cardData | year = Just y }
    in
    \yr -> config.onChange (updatedCardData yr)


updateMonth : Config (FormConfig model msg) -> CardData model -> (String -> msg)
updateMonth config cardData =
    let
        updatedCardData m =
            { cardData | month = Just m }
    in
    \mon -> config.onChange (updatedCardData mon)


updateNumber : Config (FormConfig model msg) -> CardData model -> (String -> msg)
updateNumber config cardData =
    let
        updatedCardData n =
            { cardData | number = Just n }
    in
    \num -> config.onChange (updatedCardData num)


updateName : Config (FormConfig model msg) -> CardData model -> (String -> msg)
updateName config cardData =
    let
        updatedCardData n =
            { cardData | name = Just n }
    in
    \nn -> config.onChange (updatedCardData nn)


type FieldType
    = Name
    | Number
    | Month
    | Year
    | CVV


autocompleteAttributes : Config (FormConfig model msg) -> FieldType -> List (Html.Attribute msg)
autocompleteAttributes config fieldType =
    if config.autocomplete then
        case fieldType of
            Name ->
                [ Html.Attributes.name "ccname"
                , Html.Attributes.attribute "autocomplete" "cc-name"
                ]

            Number ->
                [ Html.Attributes.name "cardnumber"
                , Html.Attributes.attribute "autocomplete" "cc-number"
                ]

            Month ->
                [ Html.Attributes.name "ccmonth"
                , Html.Attributes.attribute "autocomplete" "cc-exp-month"
                ]

            Year ->
                [ Html.Attributes.name "ccyear"
                , Html.Attributes.attribute "autocomplete" "cc-exp-year"
                ]

            CVV ->
                [ Html.Attributes.name "cvc"
                , Html.Attributes.attribute "autocomplete" "cc-csc"
                ]

    else
        []

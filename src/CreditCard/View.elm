module CreditCard.View
    exposing
        ( form
        , numberInput
        , nameInput
        , monthInput
        , yearInput
        , ccvInput
        , cardView
        )

{-| View related functions

# Form View
@docs form

# Card View
@docs cardView

# Individual Fields View
@docs numberInput, nameInput, monthInput, yearInput, ccvInput
-}

import CreditCard.Model exposing (Model, Options, Field)
import Html exposing (Html, Attribute, div, text, input, button, label, ul, li, p)
import Html.Attributes exposing (class, type', id, value, placeholder, for)
import Html.App as App
import CreditCard.Update exposing (Msg(..))
import Input.Number as Number
import Input.Text as Text
import CreditCard.Components.Card as Card
import Helpers.Misc as Helper


{-| A view function that will render the whole form fields including the card.

To use this view, just include this function as part of your view function.

Example:

    form []
        [ Html.App.map CreditCardMsg (CreditCard.View.form model.creditCardModel)
        , button [] [ text "Checkout "]
        ]

-}
form : Model Msg -> Html Msg
form model =
    div [ class "elm-card" ]
        [ cardView model
        , numberInput "CreditCardNumber" model
        , nameInput "CreditCardName" [] model
        , monthInput "CreditCardMonth" model
        , yearInput "CreditCardYear" model
        , ccvInput "CreditCardCcv" model
        ]


{-| A view function that will render the input field for credit card number.

To use this view, just include this function as part of your view function.

Example:

    form []
        [ Html.App.map CreditCardMsg (CreditCard.View.numberInput "Number" model.creditCardModel)
        , button [] [ text "Checkout "]
        ]

-}
numberInput : String -> Model Msg -> Html Msg
numberInput id model =
    let
        ( _, maxNumberLength ) =
            Helper.minMaxNumberLength model
    in
        App.map UpdateNumber
            (viewIntField model.options
                { id = id
                , maxLength = Just maxNumberLength
                , maxValue = Nothing
                , minValue = Nothing
                }
                model.number
            )


{-| A view function that will render the input field for full name.

To use this view, just include this function as part of your view function.

Example:

    form []
        [ Html.App.map CreditCardMsg (CreditCard.View.nameInput "NameInput" model.creditCardModel)
        , button [] [ text "Checkout "]
        ]

-}
nameInput : String -> List (Attribute Text.Msg) -> Model Msg -> Html Msg
nameInput id attributes model =
    App.map UpdateName
        (viewStringField model.options
            (Text.defaultOptions id)
            attributes
            model.name
        )


{-| A view function that will render the input field for credit card expiration month.

To use this view, just include this function as part of your view function. The input field will only accept numeric input with maximum value of 12.

Example:

    form []
        [ Html.App.map CreditCardMsg (CreditCard.View.monthInput "MonthInput" model.creditCardModel)
        , button [] [ text "Checkout "]
        ]

-}
monthInput : String -> Model Msg -> Html Msg
monthInput id model =
    App.map UpdateExpirationMonth
        (viewIntField model.options
            { id = id
            , maxLength = Just 2
            , maxValue = Just 12
            , minValue = Just 1
            }
            model.expirationMonth
        )


{-| A view function that will render the input field for credit card expiration year.

To use this view, just include this function as part of your view function. The input field will only accept numeric input.

Example:

    form []
        [ Html.App.map CreditCardMsg (CreditCard.View.yearInput "YearInput" model.creditCardModel)
        , button [] [ text "Checkout "]
        ]

-}
yearInput : String -> Model Msg -> Html Msg
yearInput id model =
    App.map UpdateExpirationYear
        (viewIntField model.options
            { id = id
            , maxLength = Just 4
            , maxValue = Nothing
            , minValue = Nothing
            }
            model.expirationYear
        )


{-| A view function that will render the input field for credit card CCV/CVC number.

To use this view, just include this function as part of your view function. The input field will only accept numeric input with maximum length of 4.

Example:

    form []
        [ Html.App.map CreditCardMsg (CreditCard.View.ccvInput "CCVInput" model.creditCardModel)
        , button [] [ text "Checkout "]
        ]

-}
ccvInput : String -> Model Msg -> Html Msg
ccvInput id model =
    App.map UpdateCCV
        (viewIntField model.options
            { id = id
            , maxLength = Just 4
            , maxValue = Nothing
            , minValue = Nothing
            }
            model.ccv
        )


{-| A view function that will render the credit card.

This view will renders the credit card information such as the number, full name, expiration month/year, ccv, and the card logo.

This component also provide a card flipping animation for flipping back and forth between the front and back side of the card when displaying CCV number.
Some type of card has CCV printed on the front side of the card, in this case, the flipping animation will not be performed.

To use this view, just include this function as part of your view function. This will render the card as svg element.

Example:

    form []
        [ Html.App.map CreditCardMsg (CreditCard.Components.Card.cardView model.creditCardModel)
        , button [] [ text "Checkout "]
        ]

-}
cardView : Model Msg -> Html Msg
cardView =
    Card.cardView


viewStringField : Options -> Text.Options -> List (Attribute Text.Msg) -> Field String -> Html Text.Msg
viewStringField options textOptions attributes field =
    let
        stringInput =
            Text.input textOptions
                (List.append attributes [ placeholder options field ])
                (Helper.toStringInputModel field)
    in
        if options.showLabel then
            p []
                [ viewLabel textOptions.id options field
                , stringInput
                ]
        else
            stringInput


viewIntField : Options -> Number.Options -> Field String -> Html Number.Msg
viewIntField options numberInputOptions field =
    viewIntFieldWithAttributes options
        numberInputOptions
        [ placeholder options field ]
        field


viewIntFieldWithAttributes : Options -> Number.Options -> List (Attribute Number.Msg) -> Field String -> Html Number.Msg
viewIntFieldWithAttributes options numberInputOptions attributes field =
    let
        input =
            Number.input numberInputOptions
                attributes
                (Helper.toNumberInputModel field)
    in
        if options.showLabel then
            p []
                [ viewLabel numberInputOptions.id options field
                , input
                ]
        else
            input


viewLabel : String -> Options -> Field a -> Html msg
viewLabel id options field =
    if options.showLabel then
        field.label
            |> Maybe.map (\labelText -> label [ for id ] [ text labelText ])
            |> Maybe.withDefault (text "")
    else
        text ""


placeholder : Options -> Field a -> Attribute msg
placeholder options field =
    if options.showLabel then
        Html.Attributes.placeholder ""
    else
        field.label
            |> Maybe.map Html.Attributes.placeholder
            |> Maybe.withDefault (Html.Attributes.placeholder "")

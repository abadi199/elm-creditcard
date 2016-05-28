module View exposing (view, numberInput, nameInput, monthInput, yearInput, ccvInput)

{-| View
-}

import Model exposing (Model, Options, Field)
import Html exposing (Html, Attribute, div, text, input, button, label, ul, li, p)
import Html.Attributes exposing (class, type', id, value, placeholder, for)
import Html.App as App
import Update exposing (Msg(..), toNumberInputModel, toStringInputModel)
import Components.NumberInput as NumberInput
import Components.StringInput as StringInput
import Components.Card exposing (cardView)
import Helpers.Misc as Helper


view : Model Msg -> Html Msg
view model =
    div [ class "elm-card" ]
        [ cardView model
        , numberInput "CreditCardNumber" model
        , nameInput "CreditCardName" [] model
        , monthInput "CreditCardMonth" model
        , yearInput "CreditCardYear" model
        , ccvInput "CreditCardCcv" model
          -- , ul []
          --     [ li [] [ text "AMEX: 378282246310005" ]
          --     , li [] [ text "VISA: 4242424242424242" ]
          --     , li [] [ text "Mastercard: 5555555555554444" ]
          --     , li [] [ text "Discover: 6011111111111117" ]
          --     , li [] [ text "Maestro: 6759649826438453" ]
          --     , li [] [ text "JCB: 3530111333300000" ]
          --     , li [] [ text "Diners: 36700102000000" ]
          --     , li [] [ text "Visa Electron: 4917300800000000" ]
          --     ]
          -- , text (toString model.flipped)
        ]


numberInput : String -> Model Msg -> Html Msg
numberInput id model =
    let
        ( _, maxNumberLength ) =
            Helper.minMaxNumberLength model
    in
        App.map UpdateNumber
            (viewIntField id
                model.options
                { maxLength = Just maxNumberLength
                , maxValue = Nothing
                , minValue = Nothing
                }
                model.number
            )


nameInput : String -> List (Attribute StringInput.Msg) -> Model Msg -> Html Msg
nameInput id attributes model =
    App.map UpdateName (viewStringField id attributes model.options model.name)


monthInput : String -> Model Msg -> Html Msg
monthInput id model =
    App.map UpdateExpirationMonth
        (viewIntField id
            model.options
            { maxLength = Just 2
            , maxValue = Just 12
            , minValue = Just 1
            }
            model.expirationMonth
        )


yearInput : String -> Model Msg -> Html Msg
yearInput id model =
    App.map UpdateExpirationYear
        (viewIntField id
            model.options
            { maxLength = Just 4
            , maxValue = Nothing
            , minValue = Nothing
            }
            model.expirationYear
        )


ccvInput : String -> Model Msg -> Html Msg
ccvInput id model =
    App.map UpdateCCV
        (viewIntField id
            model.options
            { maxLength = Just 4
            , maxValue = Nothing
            , minValue = Nothing
            }
            model.ccv
        )


viewStringField : String -> List (Attribute StringInput.Msg) -> Options -> Field String -> Html StringInput.Msg
viewStringField id attributes options field =
    let
        stringInput =
            StringInput.stringInput id
                (List.append attributes [ placeholder options field ])
                (toStringInputModel field)
    in
        if options.showLabel then
            p []
                [ viewLabel id options field
                , stringInput
                ]
        else
            stringInput


viewIntField : String -> Options -> NumberInput.Options -> Field Int -> Html NumberInput.Msg
viewIntField id options numberInputOptions field =
    viewIntFieldWithAttributes id
        [ placeholder options field ]
        options
        numberInputOptions
        field


viewIntFieldWithAttributes : String -> List (Attribute NumberInput.Msg) -> Options -> NumberInput.Options -> Field Int -> Html NumberInput.Msg
viewIntFieldWithAttributes id attributes options numberInputOptions field =
    let
        input =
            NumberInput.numberInput id
                numberInputOptions
                identity
                attributes
                (toNumberInputModel field)
    in
        if options.showLabel then
            p []
                [ viewLabel id options field
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

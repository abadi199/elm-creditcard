module View exposing (view)

{-| View
-}

import Model exposing (Model, Options, Field)
import Html exposing (Html, Attribute, div, text, input, button, label, ul, li)
import Html.Attributes exposing (class, type', id, value, placeholder)
import Html.App as App
import Update exposing (Msg(..), toNumberInputModel, toStringInputModel)
import Components.NumberInput as NumberInput exposing (numberInput)
import Components.StringInput as StringInput exposing (stringInput)
import Components.Card exposing (viewCard)
import Helpers.Misc as Helper


view : Model Msg -> Html Msg
view model =
    let
        ( minNumberLength, maxNumberLength ) =
            Helper.minMaxNumberLength model
    in
        div [ class "elm-card" ]
            [ viewCard model
            , App.map UpdateNumber
                (viewIntField model.options
                    { maxLength = Just maxNumberLength
                    , maxValue = Nothing
                    , minValue = Nothing
                    }
                    model.number
                )
            , App.map UpdateName (viewStringField model.options model.name)
            , App.map UpdateExpirationMonth
                (viewIntField model.options
                    { maxLength = Just 2
                    , maxValue = Just 12
                    , minValue = Just 1
                    }
                    model.expirationMonth
                )
            , App.map UpdateExpirationYear
                (viewIntField model.options
                    { maxLength = Just 4
                    , maxValue = Nothing
                    , minValue = Nothing
                    }
                    model.expirationYear
                )
            , App.map UpdateCCV
                (viewIntField model.options
                    { maxLength = Just 4
                    , maxValue = Nothing
                    , minValue = Nothing
                    }
                    model.ccv
                )
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
            , text (toString model.flipped)
            ]


viewStringField : Options -> Field String -> Html StringInput.Msg
viewStringField options field =
    div []
        [ viewLabel options field
        , stringInput [ placeholder options field ]
            (toStringInputModel field)
        ]


viewIntField : Options -> NumberInput.Options -> Field Int -> Html NumberInput.Msg
viewIntField options numberInputOptions field =
    viewIntFieldWithAttributes [ placeholder options field ]
        options
        numberInputOptions
        field


viewIntFieldWithAttributes : List (Attribute NumberInput.Msg) -> Options -> NumberInput.Options -> Field Int -> Html NumberInput.Msg
viewIntFieldWithAttributes attributes options numberInputOptions field =
    div []
        [ viewLabel options field
        , numberInput numberInputOptions
            identity
            attributes
            (toNumberInputModel field)
        ]


viewLabel : Options -> Field a -> Html msg
viewLabel options field =
    if options.showLabel then
        field.label
            |> Maybe.map (\labelText -> label [] [ text labelText ])
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

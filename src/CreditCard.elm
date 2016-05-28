module CreditCard
    exposing
        ( form
        , numberInput
        , nameInput
        , monthInput
        , yearInput
        , ccvInput
        , cardView
        , update
        , init
        , Model
        , Msg
        )

{-| Pretty credit card library.

# Update
@docs  update

# Model
@docs Model, init

# View
@docs form, numberInput, nameInput, monthInput, yearInput, ccvInput, cardView

# Msg
@docs Msg
-}

import Html exposing (Html, Attribute)
import Html.App as App
import Model
import Update exposing (Msg)
import View
import Components.Card as Card
import Components.StringInput as StringInput


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


{-| Model
-}
type alias Model =
    Model.Model Msg


{-| Initialize the model
-}
init : Model
init =
    Model.init


{-| Renders the card form
-}
form : Model -> Html Msg
form =
    View.view


{-| Renders the input field for Credit Card number
-}
numberInput : String -> Model -> Html Msg
numberInput =
    View.numberInput


{-| Renders the input field for Credit Card full name
-}
nameInput : String -> List (Attribute StringInput.Msg) -> Model -> Html Msg
nameInput =
    View.nameInput


{-| Renders the input field for Credit Card expiration month
-}
monthInput : String -> Model -> Html Msg
monthInput =
    View.monthInput


{-| Renders the input field for Credit Card expiration year
-}
yearInput : String -> Model -> Html Msg
yearInput =
    View.yearInput


{-| Renders the input field for Credit Card ccv
-}
ccvInput : String -> Model -> Html Msg
ccvInput =
    View.ccvInput


{-| Renders the Credit Card
-}
cardView : Model -> Html Msg
cardView =
    Card.cardView


{-| Update the model
-}
update : Msg -> Model -> ( Model, Cmd Msg )
update =
    Update.update


main : Program Never
main =
    App.program
        { init = ( init, Cmd.none )
        , view = form
        , update = update
        , subscriptions = subscriptions
        }


{-| Msg
-}
type alias Msg =
    Update.Msg

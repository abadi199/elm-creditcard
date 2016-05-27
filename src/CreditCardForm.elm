module CreditCardForm exposing (view, update, init, Model)

{-| Pretty credit card library.

# Event handlers
@docs view, update

# Model
@docs Model, init
-}

import Html exposing (Html)
import Html.App as App
import Model
import Update exposing (Msg)
import View


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
view : Model -> Html Msg
view =
    View.view


{-| Update the model
-}
update : Msg -> Model -> ( Model, Cmd Msg )
update =
    Update.update


main : Program Never
main =
    App.program
        { init = ( init, Cmd.none )
        , view = view
        , update = update
        , subscriptions = subscriptions
        }

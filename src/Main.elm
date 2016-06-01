module Main
    exposing
        ( main
        )

import Html.App as App
import CreditCard.Model as Model
import CreditCard.Update as Update exposing (Msg)
import CreditCard.View as View


subscriptions : Model.Model Msg -> Sub Msg
subscriptions model =
    Sub.none


main : Program Never
main =
    App.program
        { init = ( Model.init Model.defaultOptions, Cmd.none )
        , view = View.form
        , update = Update.update
        , subscriptions = subscriptions
        }

module Demo exposing (main)

import Html exposing (Html)
import CreditCard
import CreditCard.Config


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , subscriptions = subscriptions
        , view = view
        , update = update
        }


type alias Model =
    { number : Maybe String
    , name : Maybe String
    , month : Maybe String
    , year : Maybe String
    , ccv : Maybe String
    , state : CreditCard.State Msg
    }


type Msg
    = NoOp
    | UpdateCardNumber (Maybe String)
    | UpdateName (Maybe String)
    | UpdateMonth (Maybe String)
    | UpdateYear (Maybe String)
    | UpdateCCV (Maybe String)


init : ( Model, Cmd Msg )
init =
    ( Model (Just "4242424242424242") Nothing Nothing Nothing Nothing CreditCard.initialState
    , Cmd.none
    )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Html Msg
view model =
    let
        config =
            CreditCard.Config.defaultConfig
    in
        CreditCard.card
            config
            model.state
            model


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model, Cmd.none )

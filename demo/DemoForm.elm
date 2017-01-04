module DemoForm exposing (main)

import Html exposing (Html, div, input, label, text, p, form)
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
    , state : CreditCard.State
    }


type Msg
    = NoOp
    | UpdateCardNumber (Maybe String)
    | UpdateName (Maybe String)
    | UpdateMonth (Maybe String)
    | UpdateYear (Maybe String)
    | UpdateCCV (Maybe String)
    | UpdateState CreditCard.State


init : ( Model, Cmd Msg )
init =
    ( Model Nothing Nothing Nothing Nothing Nothing CreditCard.initialState
    , Cmd.none
    )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Html Msg
view model =
    let
        config =
            CreditCard.Config.defaultFormConfig
                { updateNumber = UpdateCardNumber
                , updateName = UpdateName
                , updateMonth = UpdateMonth
                , updateYear = UpdateYear
                , updateCCV = UpdateCCV
                , updateState = UpdateState
                }
    in
        form []
            [ CreditCard.form
                config
                model
            ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        UpdateCardNumber value ->
            ( { model | number = value }, Cmd.none )

        UpdateName value ->
            ( { model | name = value }, Cmd.none )

        UpdateMonth value ->
            ( { model | month = value }, Cmd.none )

        UpdateYear value ->
            ( { model | year = value }, Cmd.none )

        UpdateCCV value ->
            ( { model | ccv = value }, Cmd.none )

        UpdateState state ->
            ( { model | state = state }
            , Cmd.none
            )

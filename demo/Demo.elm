module Demo exposing (main)

import Html exposing (Html, div, input, label, text, p, form)
import Html.Attributes exposing (type_, value)
import Html.Events exposing (onInput)
import CreditCard
import CreditCard.Config
import CreditCard.Events exposing (onCCVFocus, onCCVBlur)


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
            CreditCard.Config.defaultConfig

        field labelText typeValue val msg =
            fieldWithAttributes [] labelText typeValue val msg

        fieldWithAttributes attributes labelText typeValue val msg =
            p []
                [ label []
                    [ text labelText
                    , input
                        ([ type_ typeValue
                         , value <| Maybe.withDefault "" val
                         , onInput (Just >> msg)
                         ]
                            ++ attributes
                        )
                        []
                    ]
                ]
    in
        form []
            [ CreditCard.card
                config
                model.state
                model
            , field "Number" "number" model.number UpdateCardNumber
            , field "Name" "text" model.name UpdateName
            , field "Month" "number" model.month UpdateMonth
            , field "Year" "number" model.year UpdateYear
            , fieldWithAttributes
                [ onCCVFocus UpdateState model
                , onCCVBlur UpdateState model
                , onInput (Just >> UpdateCCV)
                ]
                "Ccv"
                "number"
                model.ccv
                UpdateCCV
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

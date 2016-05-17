module Card exposing (view, update, Model, init)

{-| Pretty credit card library.

# Event handlers
@docs view, update

# Model
@docs Model, init
-}

import Html exposing (Html, div, text, input, button, label)
import Html.Attributes exposing (placeholder, class, type', id, value)
import Html.Events exposing (onInput)
import Html.App as Html
import Svg exposing (svg, rect, text')
import Svg.Attributes exposing (width, height, viewBox, x, y, rx, ry, fill, fontSize, fontFamily)
import String
import Char
import NumberInput exposing (numberInput)


{-| Options
-}
type alias Options =
    { showLabel : Bool }


{-| Model
-}
type alias Model =
    { options : Options
    , number : Field Int
    , name : Field String
    , expirationMonth : Field String
    , expirationYear : Field String
    , ccv : Field String
    }


type alias Field a =
    { id : String
    , label : Maybe String
    , value : Maybe a
    }


type CardType
    = Visa
    | Mastercard
    | Amex
    | Discovery


{-| View
-}
view : Model -> Html Msg
view model =
    div [ class "elm-card" ]
        [ viewCard model
        , Html.map UpdateNumber (viewIntField model.options model.number)
        , viewField UpdateName model.options model.name
        , viewField UpdateExpirationMonth model.options model.expirationMonth
        , viewField UpdateExpirationYear model.options model.expirationYear
        , viewField UpdateCCV model.options model.ccv
        ]


textColor : String
textColor =
    "rgba(255,255,255,0.7)"


viewCard : Model -> Html Msg
viewCard model =
    svg [ width "350", height "220", viewBox "0 0 350 220", fontFamily "Helvetica" ]
        [ rect [ x "0", y "0", width "350", height "220", rx "5", ry "5", fill "rgba(0, 0, 0, 0.4)" ] []
        , viewCardType model
        , text' [ x "40", y "120", fontSize "26", fill textColor ] [ Svg.text (printNumber model.number.value) ]
        , text' [ x "40", y "180", fontSize "16", fill textColor ] [ Svg.text "ABADI KURNIAWAN" ]
        , text' [ x "240", y "180", fontSize "14", fill textColor ] [ Svg.text "11/2019" ]
        ]


printNumber : Maybe Int -> String
printNumber maybeNumber =
    maybeNumber
        |> Maybe.map toString
        |> Maybe.withDefault "--- --- ---- ----"


viewCardType : Model -> Html Msg
viewCardType model =
    let
        cardType =
            Amex

        viewVisa x' y' =
            text' [ x (toString x'), y (toString y'), fontSize "12", fill textColor ] [ Svg.text "VISA" ]

        viewMastercard x' y' =
            text' [ x (toString x'), y (toString y'), fontSize "12", fill textColor ] [ Svg.text "Mastercard" ]

        viewAmex x' y' =
            text' [ x (toString x'), y (toString y'), fontSize "12", fill textColor ] [ Svg.text "AMEX" ]

        viewDiscovery x' y' =
            text' [ x (toString x'), y (toString y'), fontSize "12", fill textColor ] [ Svg.text "Discovery" ]
    in
        case cardType of
            Visa ->
                viewVisa 280 40

            Mastercard ->
                viewMastercard 280 40

            Amex ->
                viewAmex 280 40

            Discovery ->
                viewDiscovery 280 40


viewLabel options field =
    if options.showLabel then
        field.label
            |> Maybe.map (\labelText -> label [] [ text labelText ])
            |> Maybe.withDefault (text "")
    else
        text ""


viewField : (String -> Msg) -> Options -> Field String -> Html Msg
viewField tagger options field =
    let
        viewPlaceholder =
            if options.showLabel then
                placeholder ""
            else
                field.label
                    |> Maybe.map placeholder
                    |> Maybe.withDefault (placeholder "")
    in
        div []
            [ viewLabel options field
            , input [ viewPlaceholder, onInput tagger, value (field.value |> Maybe.withDefault "") ] []
            ]


viewIntField options field =
    div []
        [ viewLabel options field
        , numberInput (field.value |> Maybe.map toString |> Maybe.withDefault "")
        ]


toFormattedNumber number =
    number
        |> toString
        |> Debug.log ""
        |> String.toList
        |> List.foldl
            (\char list ->
                if List.length list > 0 && ((List.length list) % 4) == 0 then
                    ' ' :: char :: list
                else
                    char :: list
            )
            []
        |> String.fromList


{-| Update
-}
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        UpdateNumber numberInputMsg ->
            ( updateNumber model numberInputMsg, Cmd.none )

        UpdateName _ ->
            ( model, Cmd.none )

        UpdateExpirationMonth _ ->
            ( model, Cmd.none )

        UpdateExpirationYear _ ->
            ( model, Cmd.none )

        UpdateCCV _ ->
            ( model, Cmd.none )


updateNumber : Model -> NumberInput.Msg -> Model
updateNumber model numberInputMsg =
    let
        number =
            model.number

        newNumber =
            number.value
                |> Maybe.map toString
                |> Maybe.withDefault ""
                |> NumberInput.update numberInputMsg
                |> String.toInt
                |> Result.toMaybe
    in
        { model | number = { number | value = newNumber } }


{-| init
-}
init : Model
init =
    { options = { showLabel = False }
    , number = { id = "", label = Just "CC Number", value = Nothing }
    , name = { id = "", label = Just "Full Name", value = Nothing }
    , expirationMonth = { id = "", label = Just "mm", value = Nothing }
    , expirationYear = { id = "", label = Just "yyyy", value = Nothing }
    , ccv = { id = "", label = Just "ccv", value = Nothing }
    }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


type Msg
    = NoOp
    | UpdateNumber NumberInput.Msg
    | UpdateName String
    | UpdateExpirationMonth String
    | UpdateExpirationYear String
    | UpdateCCV String


main =
    Html.program { init = ( init, Cmd.none ), view = view, update = update, subscriptions = subscriptions }

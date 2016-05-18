module Card exposing (view, update, Model, init)

{-| Pretty credit card library.

# Event handlers
@docs view, update

# Model
@docs Model, init
-}

import Html exposing (Html, div, text, input, button, label)
import Html.Attributes exposing (class, type', id, value)
import Html.Events exposing (onInput)
import Html.App as Html
import Svg exposing (svg, rect, text')
import Svg.Attributes exposing (width, height, viewBox, x, y, rx, ry, fill, fontSize, fontFamily)
import String
import Char
import NumberInput exposing (numberInput)
import Helper


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
    , expirationMonth : Field Int
    , expirationYear : Field Int
    , ccv : Field Int
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
        , Html.map UpdateNumber (viewIntField model.options 16 model.number)
        , viewField UpdateName model.options model.name
        , Html.map UpdateExpirationMonth (viewIntField model.options 2 model.expirationMonth)
        , Html.map UpdateExpirationYear (viewIntField model.options 4 model.expirationYear)
        , Html.map UpdateCCV (viewIntField model.options 4 model.ccv)
        ]


maxNumberLength : Int
maxNumberLength =
    16


textColor : String
textColor =
    "rgba(255,255,255,0.7)"


viewCard : Model -> Html Msg
viewCard model =
    svg [ width "350", height "220", viewBox "0 0 350 220", fontFamily "monospace" ]
        [ rect [ x "0", y "0", width "350", height "220", rx "5", ry "5", fill "rgba(0, 0, 0, 0.4)" ] []
        , viewCardType model
        , text' [ x "40", y "120", fontSize "24", fill textColor ] [ Svg.text (printNumber model.number.value) ]
        , text' [ x "40", y "180", fontSize "16", fill textColor ] [ Svg.text "ABADI KURNIAWAN" ]
        , text' [ x "240", y "180", fontSize "14", fill textColor ] [ Svg.text "11/2019" ]
        ]


printNumber : Maybe Int -> String
printNumber maybeNumber =
    maybeNumber
        |> Maybe.map toString
        |> Maybe.withDefault ""
        |> formatNumber


rightPad : Char -> String -> String
rightPad char number =
    if String.length number < maxNumberLength then
        rightPad char (number ++ String.fromChar char)
    else
        number


formatNumber : String -> String
formatNumber number =
    number
        |> rightPad '•'
        |> String.toList
        |> Helper.partition 4
        |> List.map ((::) ' ')
        |> List.concat
        |> String.fromList


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


viewLabel : Options -> Field a -> Html msg
viewLabel options field =
    if options.showLabel then
        field.label
            |> Maybe.map (\labelText -> label [] [ text labelText ])
            |> Maybe.withDefault (text "")
    else
        text ""


placeholder options field =
    if options.showLabel then
        Html.Attributes.placeholder ""
    else
        field.label
            |> Maybe.map Html.Attributes.placeholder
            |> Maybe.withDefault (Html.Attributes.placeholder "")


viewField : (String -> Msg) -> Options -> Field String -> Html Msg
viewField tagger options field =
    div []
        [ viewLabel options field
        , input [ placeholder options field, onInput tagger, value (field.value |> Maybe.withDefault "") ] []
        ]


viewIntField : Options -> Int -> Field Int -> Html NumberInput.Msg
viewIntField options maxLength field =
    div []
        [ viewLabel options field
        , numberInput (Just maxLength)
            identity
            [ placeholder options field ]
            (field.value |> Maybe.map toString |> Maybe.withDefault "")
        ]


{-| Update
-}
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        UpdateNumber numberInputMsg ->
            ( { model | number = updateFieldValue (updateNumberInput numberInputMsg model.number) model.number }
            , Cmd.none
            )

        UpdateName name ->
            ( { model | name = updateFieldValue (Just name) model.name }
            , Cmd.none
            )

        UpdateExpirationMonth numberInputMsg ->
            ( { model | expirationMonth = updateFieldValue (updateNumberInput numberInputMsg model.expirationMonth) model.expirationMonth }
            , Cmd.none
            )

        UpdateExpirationYear numberInputMsg ->
            ( { model | expirationYear = updateFieldValue (updateNumberInput numberInputMsg model.expirationYear) model.expirationYear }
            , Cmd.none
            )

        UpdateCCV numberInputMsg ->
            ( { model | ccv = updateFieldValue (updateNumberInput numberInputMsg model.ccv) model.ccv }
            , Cmd.none
            )


updateFieldValue : Maybe a -> Field a -> Field a
updateFieldValue newValue field =
    { field | value = newValue }


updateNumberInput numberInputMsg field =
    field.value
        |> Maybe.map toString
        |> Maybe.withDefault ""
        |> NumberInput.update numberInputMsg
        |> String.toInt
        |> Result.toMaybe


{-| init
-}
init : Model
init =
    { options = { showLabel = False }
    , number = { id = "", label = Just "CC Number", value = Nothing }
    , name = { id = "", label = Just "Full Name", value = Nothing }
    , expirationMonth = { id = "", label = Just "MM", value = Nothing }
    , expirationYear = { id = "", label = Just "YYYY", value = Nothing }
    , ccv = { id = "", label = Just "CCV", value = Nothing }
    }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


type Msg
    = NoOp
    | UpdateNumber NumberInput.Msg
    | UpdateName String
    | UpdateExpirationMonth NumberInput.Msg
    | UpdateExpirationYear NumberInput.Msg
    | UpdateCCV NumberInput.Msg


main =
    Html.program { init = ( init, Cmd.none ), view = view, update = update, subscriptions = subscriptions }

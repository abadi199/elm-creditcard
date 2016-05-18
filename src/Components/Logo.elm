module Components.Logo exposing (viewLogo)

import Html exposing (Html)
import Svg exposing (svg, rect, text')
import Svg.Attributes exposing (width, height, viewBox, x, y, rx, ry, fill, fontSize, fontFamily)
import CardType exposing (CardType(..))
import Model exposing (Model)
import Update exposing (Msg)


viewLogo : Model -> Html Msg
viewLogo model =
    let
        cardType =
            model.number.value
                |> Maybe.map toString
                |> Maybe.withDefault ""
                |> CardType.detect

        viewVisa x' y' =
            text' [ x (toString x'), y (toString y'), fontSize "12", fill model.styles.textColor ] [ Svg.text "VISA" ]

        viewMastercard x' y' =
            text' [ x (toString x'), y (toString y'), fontSize "12", fill model.styles.textColor ] [ Svg.text "Mastercard" ]

        viewAmex x' y' =
            text' [ x (toString x'), y (toString y'), fontSize "12", fill model.styles.textColor ] [ Svg.text "AMEX" ]

        viewDiscovery x' y' =
            text' [ x (toString x'), y (toString y'), fontSize "12", fill model.styles.textColor ] [ Svg.text "Discovery" ]
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

            _ ->
                viewVisa 280 40

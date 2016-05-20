module Components.Logo exposing (viewLogo)

import Html exposing (Html)
import Svg exposing (svg, rect, text', g)
import Svg.Attributes exposing (transform, width, height, viewBox, x, y, rx, ry, fill, fontSize, fontFamily)
import CardType exposing (CardType(..))
import Model exposing (Model)
import Update exposing (Msg)
import String
import Components.Logo.Visa as Visa


viewLogo : Model -> Html Msg
viewLogo model =
    let
        cardType =
            model.number.value
                |> Maybe.map toString
                |> Maybe.withDefault ""
                |> CardType.detect

        unknownText =
            model.options.blankChar
                |> List.repeat 4
                |> String.fromList

        viewVisa =
            g [ transform ("translate(260,40)") ] [ Visa.viewLogo ]

        viewMastercard x' y' =
            text' [ x (toString x'), y (toString y'), fontSize "12", fill model.styles.textColor ] [ Svg.text "Mastercard" ]

        viewAmex x' y' =
            text' [ x (toString x'), y (toString y'), fontSize "12", fill model.styles.textColor ] [ Svg.text "AMEX" ]

        viewDiscover x' y' =
            text' [ x (toString x'), y (toString y'), fontSize "12", fill model.styles.textColor ] [ Svg.text "Discover" ]

        viewUnknown x' y' =
            text' [ x (toString x'), y (toString y'), fontSize "12", fill model.styles.textColor ] [ Svg.text unknownText ]
    in
        case cardType |> Debug.log "" of
            Visa ->
                viewVisa

            Mastercard ->
                viewMastercard 280 40

            Amex ->
                viewAmex 280 40

            Discover ->
                viewDiscover 280 40

            _ ->
                viewUnknown 280 40

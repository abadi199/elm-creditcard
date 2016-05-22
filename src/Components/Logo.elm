module Components.Logo exposing (viewLogo)

import Html exposing (Html)
import Svg exposing (svg, rect, text', g)
import Svg.Attributes exposing (transform, width, height, viewBox, x, y, rx, ry, fill, fontSize, fontFamily)
import Model exposing (Model, CardType(..))
import Update exposing (Msg)
import String
import Components.Logo.Visa as Visa
import Components.Logo.VisaElectron as VisaElectron
import Components.Logo.Mastercard as Mastercard
import Components.Logo.Amex as Amex
import Components.Logo.Discover as Discover
import Components.Logo.Maestro as Maestro
import Components.Logo.JCB as JCB
import Components.Logo.Diners as Diners


viewLogo : Model Msg -> Html Msg
viewLogo model =
    let
        cardType =
            model.cardInfo.cardType

        unknownText =
            model.options.blankChar
                |> List.repeat 4
                |> String.fromList

        viewVisa =
            g [ transform "translate(270,20)" ] [ Visa.viewLogo ]

        viewMastercard =
            g [ transform "translate(280,20)" ] [ Mastercard.viewLogo ]

        viewAmex =
            g [ transform "translate(285, 15)" ] [ Amex.viewLogo ]

        viewDiscover =
            g [ transform "translate(50, 30)" ] [ Discover.viewLogo ]

        viewMaestro =
            g [ transform "translate(280,20)" ] [ Maestro.viewLogo ]

        viewJCB =
            g [ transform "translate(285, 15)" ] [ JCB.viewLogo ]

        viewDiners =
            g [ transform "translate(290, 20)" ] [ Diners.viewLogo ]

        viewVisaElectron =
            g [ transform "translate(270,20)" ] [ VisaElectron.viewLogo ]

        viewUnknown =
            text' [ x "280", y "40", fontSize "12", fill model.cardInfo.cardStyle.textColor ] [ Svg.text unknownText ]
    in
        case cardType of
            Visa ->
                viewVisa

            Mastercard ->
                viewMastercard

            Amex ->
                viewAmex

            Discover ->
                viewDiscover

            Maestro ->
                viewMaestro

            JCB ->
                viewJCB

            DinersClubCarteBlanche ->
                viewDiners

            DinersClubInternational ->
                viewDiners

            VisaElectron ->
                viewVisaElectron

            Laser ->
                viewUnknown

            Unknown ->
                viewUnknown

module CreditCard.Components.Logo exposing (viewLogo)

import CreditCard.Components.Logo.Amex as Amex
import CreditCard.Components.Logo.Diners as Diners
import CreditCard.Components.Logo.Discover as Discover
import CreditCard.Components.Logo.JCB as JCB
import CreditCard.Components.Logo.Maestro as Maestro
import CreditCard.Components.Logo.Mastercard as Mastercard
import CreditCard.Components.Logo.Visa as Visa
import CreditCard.Components.Logo.VisaElectron as VisaElectron
import CreditCard.Config exposing (Config)
import CreditCard.Internal exposing (CardInfo, CardType(..))
import Helpers.CardAnimation as CardAnimation
import Html exposing (Html)
import String
import Svg exposing (g, rect, svg, text_)
import Svg.Attributes exposing (fill, fontFamily, fontSize, height, rx, ry, transform, viewBox, width, x, y)


viewLogo : Config config -> CardInfo msg -> Html msg
viewLogo config cardInfo =
    let
        cardType =
            cardInfo.cardType

        unknownLogo =
            config.blankChar
                |> List.repeat 4
                |> String.fromList

        viewVisa =
            g [ transform "translate(270,20)" ] [ Visa.viewLogo ]

        viewMastercard =
            g [ transform "translate(280,20)" ] [ Mastercard.viewLogo ]

        viewAmex =
            g [ transform "translate(285,20)" ] [ Amex.viewLogo ]

        viewDiscover =
            g [ transform "translate(200,20)" ] [ Discover.viewLogo ]

        viewMaestro =
            g [ transform "translate(280,20)" ] [ Maestro.viewLogo ]

        viewJCB =
            g [ transform "translate(285,15)" ] [ JCB.viewLogo ]

        viewDiners =
            g [ transform "translate(290,20)" ] [ Diners.viewLogo ]

        viewVisaElectron =
            g [ transform "translate(270,20)" ] [ VisaElectron.viewLogo ]

        viewUnknown =
            text_ [ x "280", y "40", fontSize "12", fill cardInfo.cardStyle.textColor ] [ Svg.text unknownLogo ]
    in
    g [ CardAnimation.fadeInAnimation ]
        [ case cardType of
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
        ]

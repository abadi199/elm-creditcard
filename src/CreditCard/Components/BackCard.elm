module CreditCard.Components.BackCard exposing (viewBackCard)

import CreditCard.Internal exposing (CVVPosition(..), CardData, CardInfo, getStateValue)
import Helpers.CardAnimation exposing (backsideAnimation)
import Svg exposing (Svg, g, rect, text, text_)
import Svg.Attributes exposing (fill, fontSize, height, id, rx, ry, width, x, y)


viewBackCard : CardInfo msg -> CardData model -> Svg msg
viewBackCard cardInfo cardData =
    let
        cardStyle =
            cardInfo.cardStyle

        cvv =
            cardData.cvv
                |> Maybe.withDefault "CVV"

        stateValue =
            getStateValue cardData.state
    in
    g [ id "elmCardSvgBack", backsideAnimation stateValue.flipped ]
        [ rect (List.append [ x "0", y "0", width "350", height "220", rx "5", ry "5", fill "gray" ] cardStyle.background.attributes) []
        , rect [ x "0", y "20", width "350", height "40", fill "#333" ] []
        , rect [ x "30", y "90", width "290", height "40", fill "rgba(255,255,255,0.5)" ] []
        , if cardInfo.cvvPosition == Back then
            text_ [ x "270", y "115", fontSize "14", fill cardStyle.darkTextColor ] [ text cvv ]
          else
            text ""
        ]

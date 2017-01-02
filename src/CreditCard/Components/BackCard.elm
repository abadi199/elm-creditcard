module CreditCard.Components.BackCard exposing (viewBackCard)

import CreditCard.Internal exposing (CardData, CardInfo, CCVPosition(..), getStateValue)
import Svg exposing (Svg, rect, text_, text, g)
import Svg.Attributes exposing (id, x, y, width, height, fill, rx, ry, fontSize)
import Helpers.CardAnimation exposing (backsideAnimation)


viewBackCard : CardInfo msg -> CardData model -> Svg msg
viewBackCard cardInfo cardData =
    let
        cardStyle =
            cardInfo.cardStyle

        ccv =
            cardData.ccv
                |> Maybe.withDefault "CCV"

        stateValue =
            getStateValue cardData.state
    in
        g [ id "elmCardSvgBack", backsideAnimation stateValue.flipped ]
            [ rect (List.append [ x "0", y "0", width "350", height "220", rx "5", ry "5", fill "gray" ] cardStyle.background.attributes) []
            , rect [ x "0", y "20", width "350", height "40", fill "#333" ] []
            , rect [ x "30", y "90", width "290", height "40", fill "rgba(255,255,255,0.5)" ] []
            , (if (cardInfo.ccvPosition == Back) then
                text_ [ x "270", y "115", fontSize "14", fill cardStyle.darkTextColor ] [ text ccv ]
               else
                text ""
              )
            ]

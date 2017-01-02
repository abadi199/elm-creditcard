module CreditCard.Components.BackCard exposing (viewBackCard)

import CreditCard.Internal exposing (CardInfo, CCVPosition(..))
import Svg exposing (Svg, rect, text_, text, g)
import Svg.Attributes exposing (id, x, y, width, height, fill, rx, ry, fontSize)
import Helpers.CardAnimation exposing (backsideAnimation)
import Helpers.CardType exposing (unknownCard)


viewBackCard : CardInfo model -> Svg msg
viewBackCard model =
    let
        cardInfo =
            model.cardInfo |> Maybe.withDefault unknownCard

        cardStyle =
            cardInfo.cardStyle

        ccv =
            model.ccv.value
                |> Maybe.withDefault "CCV"
    in
        g [ id "elmCardSvgBack", backsideAnimation model.flipped ]
            [ rect (List.append [ x "0", y "0", width "350", height "220", rx "5", ry "5", fill "gray" ] cardStyle.background.attributes) []
            , rect [ x "0", y "20", width "350", height "40", fill "#333" ] []
            , rect [ x "30", y "90", width "290", height "40", fill "rgba(255,255,255,0.5)" ] []
            , (if (cardInfo.ccvPosition == Back) then
                text_ [ x "270", y "115", fontSize "14", fill cardStyle.darkTextColor ] [ text ccv ]
               else
                text ""
              )
            ]

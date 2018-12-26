module Styles.Cards.Mastercard exposing (style)

import CreditCard.Internal exposing (CardStyle)
import Helpers.CardAnimation exposing (transitionAnimation)
import Styles.Backgrounds.Gradient exposing (background)
import Svg.Attributes as Attributes exposing (class, fill, height, id, offset, rx, ry, stopColor, stopOpacity, style, width, x, x1, x2, y, y1, y2)


style : CardStyle msg
style =
    { background =
        { attributes =
            [ transitionAnimation, fill "#6E8398" ]
        , svg =
            [ background { darkColor = "#152E42", lightColor = "#6E8398" } ]
        , defs = []
        }
    , textColor = "rgba(255,255,255,0.7)"
    , lightTextColor = "rgba(255,255,255,0.3)"
    , darkTextColor = "#000"
    }

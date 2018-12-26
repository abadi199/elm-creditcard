module Styles.Cards.JCB exposing (style)

import CreditCard.Internal exposing (CardStyle)
import Helpers.CardAnimation exposing (transitionAnimation)
import Styles.Backgrounds.Gradient exposing (background)
import Svg.Attributes as Attributes exposing (fill)


style : CardStyle msg
style =
    { background =
        { attributes =
            [ transitionAnimation, fill "#0069CA" ]
        , svg =
            [ background { darkColor = "#000F4B", lightColor = "#0069CA" } ]
        , defs = []
        }
    , textColor = "rgba(255,255,255,0.7)"
    , lightTextColor = "rgba(255,255,255,0.3)"
    , darkTextColor = "#000"
    }

module Styles.Cards.Visa exposing (style)

import CreditCard.Model exposing (CardStyle)
import Svg.Attributes as Attributes exposing (fill)
import Helpers.CardAnimation exposing (transitionAnimation)
import Styles.Backgrounds.Gradient exposing (background)


style : CardStyle msg
style =
    { background =
        { attributes =
            [ transitionAnimation, fill "#025fd1" ]
        , svg =
            [ background { darkColor = "#013a7e", lightColor = "#025fd1" } ]
        , defs = []
        }
    , textColor = "rgba(255,255,255,0.7)"
    , lightTextColor = "rgba(255,255,255,0.3)"
    , darkTextColor = "#000"
    }

module Styles.Cards.Discover exposing (style)

import CreditCard.Model exposing (CardStyle, Model, CardType(..), CardInfo)
import Svg.Attributes as Attributes exposing (fill)
import Helpers.CardAnimation exposing (transitionAnimation)
import Styles.Backgrounds.Gradient exposing (background)


style : CardStyle msg
style =
    { background =
        { attributes =
            [ transitionAnimation, fill "#ADDBE8" ]
        , svg =
            [ background { darkColor = "#94B8CA", lightColor = "#ADDBE8" } ]
        , defs = []
        }
    , textColor = "rgba(255,255,255,0.7)"
    , lightTextColor = "rgba(255,255,255,0.3)"
    , darkTextColor = "#000"
    }

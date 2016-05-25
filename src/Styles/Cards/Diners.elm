module Styles.Cards.Diners exposing (style)

import Model exposing (CardStyle, Model, CardType(..), unknownCard, unknownCardStyle, CardInfo)
import Svg.Attributes as Attributes exposing (fill)
import Helpers.Misc as Helper exposing (transitionAnimation)
import Styles.Backgrounds.Gradient exposing (background)


style : CardStyle msg
style =
    { background =
        { attributes =
            [ transitionAnimation, fill "#C5C6C8" ]
        , svg =
            [ background { darkColor = "#8B8E92", lightColor = "#C5C6C8" } ]
        , defs = []
        }
    , textColor = "rgba(255,255,255,0.7)"
    , lightTextColor = "rgba(255,255,255,0.3)"
    , darkTextColor = "#000"
    }

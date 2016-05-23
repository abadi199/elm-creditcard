module Styles.Cards.Amex exposing (style)

import Model exposing (CardStyle, Model, CardType(..), unknownCard, unknownCardStyle, CardInfo)
import Svg.Attributes as Attributes exposing (fill)
import Helpers.Misc as Helper exposing (transitionAnimation)
import Styles.Backgrounds.Gradient exposing (background)


style : CardStyle msg
style =
    { background =
        { attributes =
            [ transitionAnimation, fill "#D4AF37" ]
        , svg =
            [ background { darkColor = "#7D6720", lightColor = "#D4AF37" } ]
        , defs = []
        }
    , textColor = "rgba(255,255,255,0.7)"
    , lightTextColor = "rgba(255,255,255,0.3)"
    }

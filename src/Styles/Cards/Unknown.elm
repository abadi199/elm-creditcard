module Styles.Cards.Unknown exposing (style)

import CreditCard.Internal exposing (CardStyle)
import Helpers.CardAnimation exposing (transitionAnimation)
import Svg.Attributes as Attributes exposing (fill)


style : CardStyle msg
style =
    { background = { attributes = [ transitionAnimation, fill "rgba(102, 102, 102, 1)" ], svg = [], defs = [] }
    , textColor = "rgba(255,255,255,0.7)"
    , lightTextColor = "rgba(255,255,255,0.3)"
    , darkTextColor = "#000"
    }

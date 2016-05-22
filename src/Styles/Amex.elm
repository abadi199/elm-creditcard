module Styles.Amex exposing (style)

import Model exposing (CardStyle, Model, CardType(..), unknownCard, unknownCardStyle, CardInfo)
import Svg.Attributes as Attributes exposing (style, fill, id, class, offset, rx, ry, x, x1, y, y1, x2, y2, stopColor, stopOpacity, width, height)
import Helpers.Misc as Helper exposing (transitionAnimation)


style : CardStyle msg
style =
    { background = { attributes = [ transitionAnimation, fill "#D3AF36" ], svg = [], defs = [] }
    , textColor = "rgba(255,255,255,0.7)"
    , lightTextColor = "rgba(255,255,255,0.3)"
    }

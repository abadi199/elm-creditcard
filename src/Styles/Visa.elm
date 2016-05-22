module Styles.Visa exposing (style)

import Model exposing (CardStyle)
import Svg exposing (rect, defs, linearGradient, stop)
import Svg.Attributes as Attributes exposing (style, fill, id, class, offset, rx, ry, x, x1, y, y1, x2, y2, stopColor, stopOpacity, width, height)
import Helpers.Misc as Helper exposing (transitionAnimation)


style : CardStyle msg
style =
    { background =
        { attributes =
            [ transitionAnimation, fill "#013a7e" ]
        , defs =
            [ linearGradient [ id "Gradient1" ]
                [ stop [ class "stop1", offset "0%" ] []
                , stop [ class "stop2", offset "50%" ] []
                , stop [ class "stop3", offset "100%" ] []
                ]
            , linearGradient [ id "Gradient2", x1 "0", x2 "0", y1 "0", y2 "1" ]
                [ stop [ offset "0%", stopColor "red" ] []
                , stop [ offset "50%", stopColor "black", stopOpacity "0" ] []
                , stop [ offset "100%", stopColor "blue" ] []
                ]
            ]
        , svg =
            [ rect [ x "0", y "0", width "100%", height "100%", rx "5", ry "5", fill "url(#Gradient2)" ] [] ]
        }
    , textColor = "rgba(255,255,255,0.7)"
    , lightTextColor = "rgba(255,255,255,0.3)"
    }

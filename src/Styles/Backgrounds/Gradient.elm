module Styles.Backgrounds.Gradient exposing (background)

import Svg exposing (Svg, radialGradient, stop, rect, linearGradient, g)
import Svg.Attributes as Attributes exposing (stopColor, offset, id, x1, y1, x2, y2, stopOpacity, x, y, width, height, rx, ry, fill)


type alias Options =
    { darkColor : String
    , lightColor : String
    }


background : Options -> Svg msg
background options =
    g []
        [ linearGradient [ id "Gradient1", x1 "0", x2 "1", y1 "0", y2 "0.5" ]
            [ stop [ offset "0%", stopColor options.darkColor ] []
            , stop [ offset "50%", stopColor "black", stopOpacity "0" ] []
            , stop [ offset "100%", stopColor options.lightColor ] []
            ]
        , rect [ x "0", y "0", width "100%", height "100%", rx "5", ry "5", fill "url(#Gradient1)" ] []
        ]

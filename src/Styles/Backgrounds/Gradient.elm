module Styles.Backgrounds.Gradient exposing (background)

import Svg exposing (Svg, g, linearGradient, radialGradient, rect, stop)
import Svg.Attributes as Attributes exposing (fill, height, id, offset, rx, ry, stopColor, stopOpacity, width, x, x1, x2, y, y1, y2)


type alias Config =
    { darkColor : String
    , lightColor : String
    }


background : Config -> Svg msg
background options =
    g []
        [ linearGradient [ id "Gradient1", x1 "0", x2 "1", y1 "0", y2 "0.5" ]
            [ stop [ offset "0%", stopColor options.darkColor ] []
            , stop [ offset "50%", stopColor "black", stopOpacity "0" ] []
            , stop [ offset "100%", stopColor options.lightColor ] []
            ]
        , rect [ x "0", y "0", width "350", height "220", rx "5", ry "5", fill "url(#Gradient1)" ] []
        ]

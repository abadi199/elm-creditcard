module CreditCard.Components.Chip exposing (viewChip, viewChipAlt)

import Html exposing (Html)
import Svg exposing (rect, path, node, g, defs, text, linearGradient, stop)
import Svg.Attributes exposing (width, height, rx, ry, x, y, style, gradientTransform, xlinkHref, type_, d, transform, id, x1, y1, x2, y2, gradientUnits, stopColor, offset, fill, class)


viewChip : Int -> Int -> Html msg
viewChip x_ y_ =
    g [ transform ("translate(" ++ toString x_ ++ ", " ++ toString y_ ++ ")") ]
        [ g [ transform "scale(0.13671875,0.13671875)", id "g3007" ]
            [ g [ transform "translate(-96.5,-252.09375)", id "g3000" ]
                [ rect [ width "250", height "250", rx "30", ry "30", x "99.510002", y "255.09", id "rect2818", style "fill:#ffcc00;stroke:#000000;stroke-width:6" ] []
                , path [ d "m 351.51,320.65 v 2.875 h -73.719 l -16.5,16.5 v 40.625 h 90.219 v 2.875 h -90.219 v 40.625 l 16.5,16.5 h 73.719 v 2.875 h -74.906 l -18.188,-18.188 0.25,-0.25 h -0.25 v -85.719 h 0.5313 l -0.5313,-0.53125 18.188,-18.188 h 74.906 z", id "path3629" ] []
                , path [ d "m 188.28,422.65 v 2.875 h 34.812 v 81.562 h 2.8437 v -81.562 h 34.844 v -2.875 h -72.5 z", id "rect3596" ] []
                , path [ d "m 223.09,255.81 v 82.844 h -34.812 v 2.875 h 37.656 V 255.81 h -2.8437 z", id "rect3598" ] []
                , path [ d "m 97.53,320.65 v 2.875 h 73.719 l 16.5,16.5 V 380.65 H 97.53 v 2.875 h 90.219 v 40.625 l -16.5,16.5 H 97.53 v 2.875 h 74.906 l 18.188,-18.188 -0.25,-0.25 h 0.25 v -85.719 h -0.5312 l 0.5312,-0.53125 -18.188,-18.188 H 97.53 z", id "rect3602" ] []
                ]
            ]
        ]


viewChipAlt : Int -> Int -> Html msg
viewChipAlt x_ y_ =
    g [ transform ("translate(" ++ toString x_ ++ ", " ++ toString y_ ++ ")") ]
        [ defs [ id "defs1200" ]
            [ linearGradient [ x1 "108.44", y1 "17.976999", x2 "110.62", y2 "24.427", id "SVGID_5_", gradientUnits "userSpaceOnUse" ]
                [ stop [ id "stop914", style "stop-color:#ffffff;stop-opacity:1", offset "0.0055" ] []
                , stop [ id "stop916", style "stop-color:#9c9d9f;stop-opacity:1", offset "1" ] []
                ]
            , linearGradient [ x1 "107.86", y1 "18.172001", x2 "110.05", y2 "24.622", id "SVGID_6_", gradientUnits "userSpaceOnUse" ]
                [ stop [ id "stop923", style "stop-color:#ffffff;stop-opacity:1", offset "0.0055" ] []
                , stop [ id "stop925", style "stop-color:#9c9d9f;stop-opacity:1", offset "1" ] []
                ]
            , linearGradient [ x1 "31.278999", y1 "55.624001", x2 "55.278999", y2 "88.290001", id "SVGID_7_", gradientUnits "userSpaceOnUse" ]
                [ stop [ id "stop1188", style "stop-color:#ffe8a7;stop-opacity:1", offset "0.1319" ] []
                , stop [ id "stop1190", style "stop-color:#ffd13b;stop-opacity:1", offset "0.4725" ] []
                ]
            , linearGradient [ x1 "31.278999", y1 "55.624001", x2 "55.278999", y2 "88.290001", id "linearGradient4188", xlinkHref "#SVGID_7_", gradientUnits "userSpaceOnUse", gradientTransform "translate(34.376115,-13.620725)" ] []
            , linearGradient [ x1 "31.278999", y1 "55.624001", x2 "55.278999", y2 "88.290001", id "linearGradient4334", xlinkHref "#SVGID_7_", gradientUnits "userSpaceOnUse", gradientTransform "translate(34.376115,-13.620725)" ] []
            ]
        , g [ transform "translate(-55.712119,-37.207275)", id "g4330" ]
            [ path [ d "m 87.801115,37.207275 h -27.065 c -2.774,0 -5.024,2.249 -5.024,5.024 v 22.993 c 0,2.774 2.25,5.024 5.024,5.024 h 27.064 c 2.775,0 5.024,-2.25 5.024,-5.024 v -22.993 c 10e-4,-2.775 -2.248,-5.024 -5.023,-5.024 z", id "path1192", style "fill:url(#linearGradient4334)" ] []
            , path [ d "m 87.801115,37.207275 h -27.065 c -2.774,0 -5.024,2.249 -5.024,5.024 v 22.993 c 0,2.774 2.25,5.024 5.024,5.024 h 27.064 c 2.775,0 5.024,-2.25 5.024,-5.024 v -22.993 c 10e-4,-2.775 -2.248,-5.024 -5.023,-5.024 z m -31.62,5.024 c 0,-2.517 2.04,-4.556 4.556,-4.556 h 9.707 c -2.008,0.76 -2.939,2.42 -2.995,4.801 v 3.832 h -11.268 v -4.077 z m 0,4.544 h 11.268 v 6.718 h -11.268 v -6.718 z m 0,7.186 h 11.268 v 6.716 h -11.268 v -6.716 z m 4.555,15.818 c -2.516,0 -4.556,-2.04 -4.556,-4.556 v -4.078 h 11.736 v -18.201 h 12.705 v 21.565 h -12.938 c -0.312,0 -0.312,0.468 0,0.468 h 12.935 c -0.075,3.071 -1.657,4.802 -5.51,4.802 h -14.372 z m 31.62,-4.556 c 0,2.516 -2.04,4.556 -4.556,4.556 h -9.707 c 2.009,-0.761 2.938,-2.42 2.996,-4.802 v -3.832 h 11.267 v 4.078 z m 0,-4.546 h -11.266 v -6.716 h 11.266 v 6.716 z m 0,-7.184 h -11.266 v -6.718 h 11.266 v 6.718 z m 0,-7.185 h -11.266 v -3.832 h -13.17 c 0.075,-3.071 1.658,-4.801 5.511,-4.801 h 14.37 c 2.516,0 4.556,2.039 4.556,4.556 v 4.077 z", id "path1194" ] []
            ]
        ]

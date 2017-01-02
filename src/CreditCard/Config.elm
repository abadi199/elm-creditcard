module CreditCard.Config exposing (Config, defaultConfig)

{-|
@docs Config, defaultConfig
-}


{-| Configuration for card view
-}
type alias Config =
    { blankChar : Char
    , blankName : String
    }


{-| The default `Config` value
-}
defaultConfig : Config
defaultConfig =
    { blankChar = '•'
    , blankName = "YOUR NAME"
    }

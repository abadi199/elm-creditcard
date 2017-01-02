module CreditCard.Config exposing (Config, defaultConfig)

{-|
@docs Config, defaultConfig
-}


{-| Configuration for card view
-}
type alias Config =
    { blankChar : Char }


{-| The default `Config` value
-}
defaultConfig : Config
defaultConfig =
    { blankChar = '•'
    }

elements =
  #audio subpage

  rowSelector:
    id: "row-sel"
    type: "radio"
    large: true
    extra_wide: true
    text_size: "large"
    buttons:
      row_1: "Lapel/DVD"
      row_2: "Handheld/CD"
      row_3: "Stage Inputs"
      
  muteGroupButton:
    muteId: "mute-group"
    btnText: "MUTE ALL"
    large: true
    classList: ['active']
  unmuteGroupButton:
    muteId: "unmute-group"
    btnText: "UNMUTE ALL"
    large: true
    classList: ['active']

  volumeButtons:
    row_1:
      vol01:
        headerText: "Wireless"
        headerWidth: "66pct"
        dividerWidth: 84
        id: 'wls-pastor'
        title: "Pastor"
        titlePos: 'top'
        large: true
        mute2: true
        mute2Id: 'wls-pastor-choir-mmxp'
        mute2Text: "CHOIR"
        mute2Color: "blue"
        mute3: true
        mute3Id: 'wls-pastor-floor-mmxp'
        mute3Text: "FLOOR"
        mute3Color: "magenta"
      vol02:
        id: 'wls-assoc'
        title: "Assoc. Pastor"
        titlePos: 'top'
        twoLine: true
        large: true
        mute2: true
        mute2Id: 'wls-assoc-choir-mmxp'
        mute2Text: "CHOIR"
        mute2Color: "blue"
        mute3: true
        mute3Id: 'wls-assoc-floor-mmxp'
        mute3Text: "FLOOR"
        mute3Color: "magenta"
      vol03:
        id: 'wls-childrens'
        title: "Childrens Pastor"
        titlePos: 'top'
        twoLine: true
        large: true
        mute2: true
        mute2Id: 'wls-children-choir-mmxp'
        mute2Text: "CHOIR"
        mute2Color: "blue"
        mute3: true
        mute3Id: 'wls-children-floor-mmxp'
        mute3Text: "FLOOR"
        mute3Color: "magenta"
      vol04:
        id: 'wls-youth'
        title: "Youth Pastor"
        titlePos: 'top'
        twoLine: true
        large: true
        mute2: true
        mute2Id: 'wls-youth-choir-mmxp'
        mute2Text: "CHOIR"
        mute2Color: "blue"
        mute3: true
        mute3Id: 'wls-youth-floor-mmxp'
        mute3Text: "FLOOR"
        mute3Color: "magenta"
      vol05:
        headerText: "DVD"
        headerWidth: "33pct"
        dividerWidth: 12
        linkable: true
        linkId: "dvd"
        linkedIds: "dvd-l dvd-r"
        id: 'dvd-l'
        title: "Left"
        titlePos: 'top'
        large: true
        mute2: true
        mute2Id: 'dvd-l-choir-mmxp'
        mute2Text: "CHOIR"
        mute2Color: "blue"
        mute3: true
        mute3Id: 'dvd-l-floor-mmxp'
        mute3Text: "FLOOR"
        mute3Color: "magenta"
      vol06:
        id: 'dvd-r'
        title: "Right"
        titlePos: 'top'
        large: true
        mute2: true
        mute2Id: 'dvd-r-choir-mmxp'
        mute2Text: "CHOIR"
        mute2Color: "blue"
        mute3: true
        mute3Id: 'dvd-r-floor-mmxp'
        mute3Text: "FLOOR"
        mute3Color: "magenta"
    row_2:
      vol01:
        headerText: "blank"
        headerWidth: "16pct"
        id: 'choir-mic'
        title: "Choir Mics"
        titlePos: 'top'
        large: true
        mute2Spacer: true
        mute3Spacer: true
      vol02:
        headerText: "CD"
        headerWidth: "33pct"
        dividerWidth: 12
        id: 'cd-l'
        title: "Left/ Music"
        titlePos: 'top'
        titleClassList: ["padding-left-12", "padding-right-12"]
        twoLine: true
        large: true
        linkable: true
        linkId: "cd"
        linkedIds: "cd-l cd-r"
        mute2Spacer: true
        mute3Spacer: true
      vol03:
        id: 'cd-r'
        title: "Right/ Voices"
        titlePos: 'top'
        twoLine: true
        large: true
        mute2Spacer: true
        mute3Spacer: true
      vol04:
        headerText: "Wireless"
        headerWidth: "50pct"
        dividerWidth: 48
        id: 'wls-red'
        title: "Red Wireless"
        titlePos: 'top'
        twoLine: true
        large: true
        mute2: true
        mute2Id: 'wls-red-choir-mmxp'
        mute2Text: "CHOIR"
        mute2Color: "blue"
        mute3: true
        mute3Id: 'wls-red-floor-mmxp'
        mute3Text: "FLOOR"
        mute3Color: "magenta"
      vol05:
        id: 'wls-blue'
        title: "Blue Wireless"
        titlePos: 'top'
        twoLine: true
        large: true
        mute2: true
        mute2Id: 'wls-blue-choir-mmxp'
        mute2Text: "CHOIR"
        mute2Color: "blue"
        mute3: true
        mute3Id: 'wls-blue-floor-mmxp'
        mute3Text: "FLOOR"
        mute3Color: "magenta"
      vol06:
        id: 'wls-orange'
        title: "Orange Wireless"
        titlePos: 'top'
        twoLine: true
        large: true
        mute2: true
        mute2Id: 'wls-orange-choir-mmxp'
        mute2Text: "CHOIR"
        mute2Color: "blue"
        mute3: true
        mute3Id: 'wls-orange-floor-mmxp'
        mute3Text: "FLOOR"
        mute3Color: "magenta"
    row_3:
      vol01:
        id: 'stage-right-mic1'
        title: "Left Input 1"
        titlePos: 'top'
        large: true
        mute2: true
        mute2Id: 'stage-right-mic1-choir-mmxp'
        mute2Text: "CHOIR"
        mute2Color: "blue"
        mute3: true
        mute3Id: 'stage-right-mic1-floor-mmxp'
        mute3Text: "FLOOR"
        mute3Color: "magenta"
      vol02:
        id: 'stage-right-mic2'
        title: "Left Input 2"
        titlePos: 'top'
        large: true
        mute2: true
        mute2Id: 'stage-right-mic2-choir-mmxp'
        mute2Text: "CHOIR"
        mute2Color: "blue"
        mute3: true
        mute3Id: 'stage-right-mic2-floor-mmxp'
        mute3Text: "FLOOR"
        mute3Color: "magenta"
      vol03:
        id: 'piano-mic'
        title: "Piano Mic"
        titlePos: 'top'
        large: true
        mute2: true
        mute2Id: 'piano-mic-choir-mmxp'
        mute2Text: "CHOIR"
        mute2Color: "blue"
        mute3: true
        mute3Id: 'piano-mic-floor-mmxp'
        mute3Text: "FLOOR"
        mute3Color: "magenta"
      vol04:
        id: 'stage-left-mic1'
        title: "Rght Input 1"
        titlePos: 'top'
        large: true
        mute2: true
        mute2Id: 'stage-left-mic1-choir-mmxp'
        mute2Text: "CHOIR"
        mute2Color: "blue"
        mute3: true
        mute3Id: 'stage-left-mic1-floor-mmxp'
        mute3Text: "FLOOR"
        mute3Color: "magenta"
      vol05:
        id: 'stage-left-mic2'
        title: "Rght Input 2"
        titlePos: 'top'
        large: true
        mute2: true
        mute2Id: 'stage-left-mic2-choir-mmxp'
        mute2Text: "CHOIR"
        mute2Color: "blue"
        mute3: true
        mute3Id: 'stage-left-mic2-floor-mmxp'
        mute3Text: "FLOOR"
        mute3Color: "magenta"

exports.elements = elements

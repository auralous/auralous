import React from "react";

export default {
  description:
    "Listen Together with Friends around the Globe in rooms. All you need is a YouTube, Spotify, or Apple Music account.",
  intro: {
    brandText: "Music Together",
    use: {
      action: "Use",
      web: "Web App",
      comingSoon: "Coming Soon",
    },
    listen: {
      title: "Listen Anywhere",
      description:
        "Stereo integrates with the music applications you know and love. All you need is a YouTube or Spotify account.",
      p:
        "Your friend listens to a different music application? No worry, you can still listen together by letting Stereo find and play that same song on your application instead.",
      action: "Start Listening",
    },
    playlist: {
      title: "Quick Start",
      p1:
        "It takes less than 30 seconds to start listening together. Just copy-paste the playlist link and start right away.",
      p2:
        "Have a good playlist to share with friends? Did your favorite artist. just release their new album? Just grab the link and go!",
      action: "Go",
    },
    rules: {
      title: "Your Room. Your Rule.",
      p1:
        "Listen either in public or private rooms. Set a password to avoid unwelcome guests. Only collaborators can add songs, but everyone can chat and add their reactions.",
      p2:
        "Invite your close friends to be moderators. Ban offended messages and people. Customize room rules so that your friends know what songs can be added.",
      p2Bold: "You are in control",
    },
  },
  contact: {
    title: "Contact",
    hi: "Hi",
    there: "there",
    how: ", how can we help?",
    p:
      "Be sure to reach out at any time should you have any ideas, questions, or encounter any bugs.",
  },
  settings: {
    title: "Settings",
    titleLink: "Connection",
    titleDangerZone: "Danger Zone",
    profileUpdated: "Profile updated",
    signedOut: "You have been signed out",
    profile: {
      title: "About myself",
      authPrompt: "Join Stereo to customize your profile.",
    },
    username: {
      label: "Username",
      helpText: "15 characters max, lowercase, no space or special characters",
    },
    profilePicture: {
      label: "Profile picture",
    },
    deleteAccount: {
      titleA11y: "Deactivate account",
      helpText: "You can delete your account at any time.",
      helpTextLinkTitle: "About your data on deactivation",
      startAction: "Deactivate Account",
      title: "Sad to See You Go...",
      description:
        "Deactivating your account will remove all of your information, rooms.",
      enterName: "Enter your username to continue",
      deletedText:
        "Your account and data has been removed. We're sorry to see you go!",
      action: "Deactivate",
      cancelAction: "Nevermind",
    },
    listening: {
      listeningOn(obj: { name: string }) {
        return (
          <>
            Listening on <b>{obj.name}</b>
          </>
        );
      },
      connectedToStereo(obj: { name: string }) {
        return (
          <>
            Your Stereo account is connected to <b>{obj.name}</b>. If you wish
            to switch
          </>
        );
      },
      contactUs: "contact us",
      changeLocalMusicApp: "Change your music application",
      selectOne: "Select one",
    },
    save: "Save",
    signOut: "Sign Out",
  },
  new: {
    title: "Start listening together",
    titleExisted: "Use an Existing Room",
    titleNew: "Create New Room",
    joinText: "Join Stereo to Create a Room",
    playlist: {
      searchTitle: "Search Playlist",
      altText: "Enter a Playlist Link",
      helpText: "Optional: Enter a playlist link to listen together",
      startListeningTo: "Start listening together to",
      featuring: "featuring",
      noResults: "No songs found from the above link",
    },
    createRoom: {
      warnNoPass:
        "The room password is not set. Anyone with the link can enter the room and become a collaborator. Continue anyway?",
      startListening: "Start Listening",
    },
    addExisted: {
      description: "Select a room to start listening",
      action: "Add and Play",
      helpText: (
        <>
          Find something by entering a playlist link above to add to an existing
          room <i>or</i> create an empty room
        </>
      ),
    },
  },
  browse: {
    title: "Browse",
    titleRandom: "Random Rooms",
    titleMy: "My Rooms",
    playlist: {
      title: "Start Listening Together",
      description:
        "Have an awesome playlist to listen together with friends? Just enter its link below.",
    },
  },
  room: {
    roomText: "Room",
    description: "Join {{title}} on Stereo and listen to music together.",
    privacy: {
      public: "Public",
      private: "Private",
    },
    main: {
      init: {
        password1:
          "Enter room password to join. Leave empty if it has no password.",
        password2:
          "You can also join by asking the host to add you as a collaborator",
        join: "Join",
        leave: "Leave",
        incorrectPassword: "Incorrect room password",
      },
    },
    settings: {
      title: "Room Settings",
      info: {
        title: "Title",
        description: "Description",
        titleHelp: "Enter a title for the room",
        descriptionHelp: "Enter a description for the room",
        handle: "Handle",
      },
      privacy: {
        title: "Privacy",
        publicAllowGuests: "Guests can add songs",
        publicAllowGuestsHelp: "If disabled, only room members can add songs",
        password: "Password",
        passwordHelp: "Anyone with a password will also become a collaborator",
        newPassword: "New Password",
        newPasswordHelp:
          "Current members are not required to enter new password",
      },
      member: {
        title: "Add a Member",
        helpText: "Enter the username of the one you want to add",
        searchText: "Search",
        addedText: "{{username}} is now a {{role}}",
        removedText: "{{username}} is no longer a member",
        userNotFound: "User Not Found",
        enterUsername: "Enter the username of the person to be added",
        offline: "Offline",
      },
      dangerZone: {
        title: "Danger Zone",
        deleteTitle: "Delete {{title}}",
        deleteDescription: "This will remove this room along with its data",
        deleteEnterToProceed: "Enter the room name to continue",
        deleteConfirmText: "Yes, delete room",
        deleteCancelText: "Nevermind",
        deletedText: "Room Deleted",
      },
      updatedText: "Room Updated",
      saveText: "Save",
      savedText: "Saved",
    },
    rules: {
      title: "Room Rules",
      anyoneCanAdd: "Anyone can add songs",
      onlyMemberCanAdd: "Only member can add songs",
      ok: "Got it!",
    },
    queue: {
      title: "Queue",
      queue: {
        title: "Queue",
      },
      search: {
        title: "Search",
      },
      playlist: {
        title: "Playlist",
      },
      played: {
        title: "Recently Played",
      },
    },
    chat: {
      title: "Chat",
      joinText: "Join Stereo to Chat",
      joinTextHook:
        "Listen to music with friends and chat no matter where they are",
      listener: "Listeners",
    },
    live: {
      title: "Live",
    },
  },
  nowPlaying: {
    title: "Now Playing",
    skipSong: "Skip song",
  },
  player: {
    label: {
      nameAndArtist: "Track name and artists",
    },
    pause: "Pause",
    play: "Play",
    noneText: "Nothing is playing",
    noneHelpText: "Add a song to listen together",
    pausedText: "Music has been paused",
    pausedHelpText: "Use the button below to unpause",
    noCrossTrackText: "is not available on",
    platformChooser: {
      altTitle: "Choose platform to play this track on",
      title: "Join Stereo or Select a Music Service",
      listenAsGuest: "Listen as guest",
      helpText:
        "You can listen on one of the music applications as guest or join Stereo for features like add songs to and from your playlists, react to songs, and more. Change your preference in",
    },
    stopPlaying: "Stop Playing",
    youtube: {
      moveToTop: "Move Player to Top",
      moveToBottom: "Move Player to Bottom",
      footerText:
        "YouTube Premium lets you enjoy ad-free and background play. See",
      footerTextAfter: "for more info",
    },
    spotify: {
      playingOn: "Playing on Spotify",
      authAskText: "Let's connect to your Spotify account to play this song.",
      authAction: "Connect to Spotify",
      connectingText: "We are connecting to Spotify to play this song.",
      errorText: "Could not connect to Spotify",
      errorHelpText:
        "We cannot connect your Spotify account. Please try again. If you need help, ",
      premiumRequired: "Spotify Premium subscription required",
      notSupported: "This browser may not be supported",
      footerText:
        "A Spotify subscription is required to play any track, ad-free. Go to",
      footerTextAfter: "to try it for free",
    },
    contactSupportText: "Contact Support",
    retryText: "Try again",
  },
  track: {
    addToPlaylist: "Add to playlist",
    listenOn: "Listen on {{platform}}",
    close: "Close",
    adder: {
      playlist: {
        selectOne: "Select a playlist",
        selectSongFrom: "Select songs from {{title}}",
        loading: "Loading playlist",
      },
      result: {
        confirmAdded: "This song has already been added. Add again?",
      },
      search: {
        title: "Search",
        placeholder: "Find by keywords or links",
        loading: "Searching...",
        helpText: (
          <>
            To search, enter the song keywords <b>or</b> a <i>Song link</i>{" "}
            <b>or</b> a <i>Playlist link</i>.
          </>
        ),
        shareVia: "Share this via",
      },
    },
  },
  queue: {
    addedBy: "Added by",
    manager: {
      removedTrackText: "Removed {{title}}",
      removeTrackText: "Remove Track",
      authPrompt: "Join to Add Songs and Listen Together",
      emptyText: "It's lonely around here... Let's add a song!",
      notAllowedText: "You are not allowed to contribute. See",
    },
  },
  playlist: {
    addTitle: "Add to Playlist",
    authPrompt: "Join Stereo to Add Songs to Playlists",
    add: {
      title: "Add to {{title}}",
      addedText: "Added",
      okText: "Added {{trackTitle}} to {{playlistTitle}}",
    },
    new: {
      title: "New Playlist",
      nameRequired: "Enter a playlist name to continue",
      errorText: "Cannot create new playlist",
      okText: "Created playlist {{title}}",
      youtubeHelpText:
        "You may need to have a YouTube channel or sign up for YouTube Music to create a playlist",
    },
  },
  share: {
    title: "Share",
    copy: "Copy",
    copied: "Copied",
  },
  chat: {
    inputLabel: "Enter chat message",
    inputPlaceholder: "Say something, I'm giving up on you 🎵",
  },
  auth: {
    hookDefault:
      "Start listening to music in sync with friends in public or private rooms. All you need is an YouTube, Spotify, or Apple Music account.",
    action: "Join now",
    label: "Sign in to Stereo",
    listenOn: "Listen on",
    cancelText: "Go back",
    footerText: {
      pre: "By continuing, you agree to our",
      privacyPolicy: "Privacy Policy",
      youtubeTerm: "YouTube Terms of Service",
      andOr: "and/or",
      whereApplicable: "where applicable",
    },
  },
  "404": {
    title: "404",
    description:
      "You hear music in the distance, but nothing can be seen here.",
  },
  footer: {
    privacy: "Privacy",
    contribute: "Contribute",
    contact: "Contact",
  },
  common: {
    backToHome: "Back to home",
    signIn: "Join",
    dangerousActionText: "This process is immediate and cannot be undone",
    tracks: "songs",
  },
  error: {
    internalError: "Internal Error:",
    unauthenticated: "Please sign in again.",
  },
};

import { extendTheme } from 'native-base'

export const { components }: Parameters<typeof extendTheme>[0] = {
  components: {
    Text: {
      baseStyle: {
        color: 'darkText',
      },
    },
    Icon: {
      baseStyle: {
        color: 'primary.700',
      },
    },
    Button: {
      baseStyle: {
        paddingY: '13px',
        borderRadius: '16px',
      },
      variants: {
        outline: ({ colorScheme }) => ({
          borderColor: `${colorScheme}.500`,
          borderWidth: '2px',
        }),
      },
    },
    Input: {
      baseStyle: {
        color: 'darkText',
        placeholderTextColor: 'gray.300',
        height: '48px',
        backgroundColor: 'card',
        borderRadius: '16px',
        _focus: {
          borderWidth: 2,
        },
      },
    },
    Toast: {
      baseStyle: {
        paddingX: 4,
        borderRadius: '16px',
        bgColor: '#666666',
        _title: {
          color: 'white',
        },
        _description: {
          color: 'white',
        },
      },
    },
    Menu: {
      baseStyle: {
        padding: 0,
        borderRadius: 0,
        borderColor: 'gray.100',
        shadow: 'none',
        backgroundColor: 'card',
      },
    },
  },
}

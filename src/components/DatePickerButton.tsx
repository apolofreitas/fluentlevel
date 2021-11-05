import React, { useEffect, useState } from 'react'
import { Button, IButtonProps, Icon } from 'native-base'
import DateTimePicker from '@react-native-community/datetimepicker'
import Feather from 'react-native-vector-icons/Feather'

interface DatePickerButtonProps extends IButtonProps {
  defaultValue: Date
  onPickDate: (date: Date) => void
}

export const DatePickerButton: React.FC<DatePickerButtonProps> = ({
  defaultValue: defaultDate,
  onPickDate,
  ...rest
}) => {
  const [mode, setMode] = useState<'none' | 'date' | 'time'>('none')
  const [date, setDate] = useState(defaultDate)

  useEffect(() => {})

  return (
    <>
      <Button
        justifyContent="flex-start"
        height="46px"
        padding={3}
        backgroundColor="card"
        borderRadius="12px"
        _text={{ color: 'primary.700' }}
        startIcon={<Icon as={Feather} name="calendar" size="sm" color="primary.500" />}
        onPress={() => setMode('date')}
        {...rest}
      />
      {mode !== 'none' && (
        <DateTimePicker
          is24Hour
          mode={mode}
          value={date}
          onChange={(_: any, date?: Date) => {
            setMode('none')

            if (!date) return

            setDate(date)

            if (mode === 'date') {
              setMode('time')
            } else if (mode === 'time') {
              onPickDate(date)
            }
          }}
        />
      )}
    </>
  )
}

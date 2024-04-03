import { FC, useCallback, useState } from "react"
import { Stepper, Button, Box } from "@mantine/core"
import dynamic from "next/dynamic"
import { ParsedUrlQuery } from "querystring"
import { useRouter } from "next/router"
import { useHarvests } from "@/hooks/useHarvests"
import {
  IconCalendarEvent,
  IconPlant,
  IconRulerMeasure,
  IconScale,
} from "@tabler/icons-react"
import classes from "./steps.module.css"

const SelectCrop = dynamic(() => import("./inputs/crop"), { ssr: false })
const SelectDate = dynamic(() => import("./inputs/date"), { ssr: false })
const SelectWeight = dynamic(() => import("./inputs/weight"), { ssr: false })
const SelectArea = dynamic(() => import("./inputs/area"), { ssr: false })
const OverviewTable = dynamic(() => import("../overviewTable"), { ssr: false })

interface Query extends ParsedUrlQuery {
  crop?: string
  date?: string
  weight?: string
  area?: string
}

const steps = [
  {
    label: "crop",
    description: "Select a crop or create a new one",
    icon: <IconPlant />,
    Children: ({ onSubmit }: { onSubmit?: () => void }) => (
      <SelectCrop onSubmit={() => onSubmit?.()} />
    ),
  },
  {
    label: "date",
    description: "Select a date of harvest",
    icon: <IconCalendarEvent />,
    Children: ({ onSubmit }: { onSubmit?: () => void }) => (
      <>
        <SelectDate onSubmit={() => onSubmit?.()} />
        <Button bg="dark.3" onClick={() => onSubmit?.()}>
          Next step
        </Button>
      </>
    ),
  },
  {
    label: "weight",
    description: "Enter the yield's weight, how much did you harvest",
    icon: <IconScale />,
    Children: ({ onSubmit }: { onSubmit?: () => void }) => (
      <SelectWeight onSubmit={() => onSubmit?.()} />
    ),
  },
  {
    label: "area",
    description:
      "Enter the area of harvest, over how big of an area did you harvest",
    icon: <IconRulerMeasure />,
    Children: ({ onSubmit }: { onSubmit?: () => void }) => (
      <SelectArea onSubmit={() => onSubmit?.()} />
    ),
  },
] as const

const Steps: FC = () => {
  const router = useRouter()
  const query = router.query as Query
  const { createHarvest } = useHarvests()

  const [active, setActive] = useState(() =>
    !query || !query.crop
      ? 0
      : !query.date
        ? 1
        : !query.weight
          ? 2
          : !query.area
            ? 3
            : 4,
  )
  const [highestStepVisited, setHighestStepVisited] = useState(active)

  const handleStepChange = (nextStep: number) => {
    const isOutOfBounds = nextStep > 4 || nextStep < 0
    if (isOutOfBounds) return

    setActive(nextStep)
    setHighestStepVisited((prev) => Math.max(prev, nextStep))
  }
  const nextStep = useCallback(() => {
    handleStepChange(active + 1)
    if (
      active === steps.length - 1 &&
      !!query.crop &&
      !!query.date &&
      !!query.weight &&
      !!query.area
    ) {
      createHarvest({
        crop: query.crop,
        date: query.date,
        weight: query.weight,
        area: query.area,
      })
    }
  }, [active, createHarvest, query.area, query.date, query.crop, query.weight])

  const shouldAllowSelectStep = (step: number) =>
    highestStepVisited >= step && active !== step && active !== steps.length

  return (
    <Stepper
      className={classes.base}
      active={active}
      onStepClick={setActive}
      size="xs"
    >
      {steps.map(({ label, description, Children, icon }, i) => (
        <Stepper.Step
          key={i}
          label={label}
          description={description}
          allowStepSelect={shouldAllowSelectStep(i)}
          icon={icon}
        >
          <Box className={classes.wrapper}>
            <Children
              onSubmit={() => {
                if (query && query[label]) nextStep()
              }}
            />
          </Box>
        </Stepper.Step>
      ))}
      <Stepper.Completed>
        <Box className={classes.wrapper}>
          <OverviewTable
            harvests={[query]}
            disableSelectRows
            hideOverviewTableFooter
            hideTableFoot
            noDownloadCSV
          />
          <Button component={"a"} href="/" bg="dark.3">
            Create New Entry
          </Button>
          <Button component={"a"} href="/overview" bg="dark.3" mt={"xs"}>
            Overview page
          </Button>
        </Box>
      </Stepper.Completed>
    </Stepper>
  )
}

export default Steps

import { FC, useCallback, useState } from "react"
import { Stepper, Button, Box } from "@mantine/core"
import dynamic from "next/dynamic"
import { ParsedUrlQuery } from "querystring"
import { useRouter } from "next/router"
import {
  IconCalendarEvent,
  IconPlant,
  IconRulerMeasure,
  IconScale,
} from "@tabler/icons-react"
import classes from "./steps.module.css"
import { setQueryOnPage } from "@/utils/setQueryOnPage"
import { AddHarvestInput, HarvestFragmentFragment } from "generated/graphql"
import { useFragment } from "generated"
import { useAddHarvest } from "@/hooks/useAddHarvest"
import { HarvestFragment } from "@/hooks/useMe"

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

const parseHarvest = (query: Query): AddHarvestInput => {
  const [weightStr, weightUnit] = (query.weight ?? "").split("_")
  const weightNum = Number(weightStr)
  const weight_g = weightUnit === "g" ? weightNum : weightNum * 1000
  const [area_m2Str, _areaUnit] = (query.area ?? "").split("_")
  const area_m2 = Number(area_m2Str)
  const yield_Kg_m2 = area_m2 > 0 ? weight_g / 1000 / area_m2 : 0
  return {
    crop: query.crop!,
    date: query.date!,
    weight_g,
    area_m2: area_m2.toFixed(3),
    yield_Kg_m2: yield_Kg_m2.toFixed(3),
  }
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

  const {
    mutateAsync: createHarvest,
    isPending: createHarvestIsPending,
    data: addHarvestData,
  } = useAddHarvest()
  const newHarvest = useFragment(HarvestFragment, addHarvestData?.addHarvest)
  const [newHarvests, setNewHarvests] = useState<HarvestFragmentFragment[]>([])
  const [currentStep, setCurrentStep] = useState(() => {
    const currentStep =
      !query || !query.crop
        ? 0
        : !query.date
          ? 1
          : !query.weight
            ? 2
            : !query.area
              ? 3
              : 4
    if (currentStep === 4 && !newHarvests.length) {
      setQueryOnPage(router, {
        crop: null,
        date: null,
        weight: null,
        area: null,
      })
      return 0
    }
    return currentStep
  })
  const [highestStepVisited, setHighestStepVisited] = useState(currentStep)
  const handleStepChange = (nextStep: number) => {
    const isOutOfBounds = nextStep > 4 || nextStep < 0
    if (isOutOfBounds) return

    setCurrentStep(nextStep)
    setHighestStepVisited((prev) => Math.max(prev, nextStep))
  }
  const nextStep = useCallback(async () => {
    handleStepChange(currentStep + 1)

    if (
      currentStep === steps.length - 1 &&
      !!query.crop &&
      !!query.date &&
      !!query.weight &&
      !!query.area
    ) {
      await createHarvest({ harvest: parseHarvest(query) })

      // setNewHarvests((prev) => [...prev, NewHarvest])
    }
  }, [currentStep, query, createHarvest])

  const shouldAllowSelectStep = (step: number) =>
    highestStepVisited >= step &&
    currentStep !== step &&
    currentStep !== steps.length

  return (
    <Stepper
      className={classes.base}
      active={currentStep}
      onStepClick={setCurrentStep}
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
            harvests={newHarvest ? [newHarvest] : []}
            disableSelectRows
            hideOverviewTableFooter
            hideTableFoot
            noDownloadCSV
            isLoading={createHarvestIsPending}
          />
          <Button component={"a"} href="/" bg="dark.3">
            Create New Entry
          </Button>
        </Box>
      </Stepper.Completed>
    </Stepper>
  )
}

export default Steps

import { FC, useCallback, useState } from "react"
import { Stepper, Button, Box, Title } from "@mantine/core"
import dynamic from "next/dynamic"
import styled from "styled-components"
import { ParsedUrlQuery } from "querystring"
import { useRouter } from "next/router"
import { useHarvests } from "@/hooks/useHarvests"
import {
  IconCalendarEvent,
  IconPlant,
  IconRulerMeasure,
  IconScale,
} from "@tabler/icons-react"

const SelectCrop = dynamic(() => import("./inputs/crop"), { ssr: false })
const SelectDate = dynamic(() => import("./inputs/date"), { ssr: false })
const SelectWeight = dynamic(() => import("./inputs/weight"), { ssr: false })
const SelectArea = dynamic(() => import("./inputs/area"), { ssr: false })
const OverviewTable = dynamic(() => import("../overviewTable"), { ssr: false })

type Query = ParsedUrlQuery & {
  crop?: string
  date?: string
  weight?: string
  area?: string
}

const StyledStepper = styled(Stepper)`
  max-width: 450px;
  .mantine-Stepper-stepIcon {
    transition: all 0.3s ease;
  }
  .mantine-Stepper-step {
    &[data-progress] {
      transform: scale(1.05);
    }
  }

  .mantine-Stepper-separator {
    transition: all 0.3s ease;
  }

  .mantine-Stepper-stepDescription {
    max-width: 100px;
  }
`

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20;
  min-height: 400px;
`

const steps = [
  {
    label: "crop",
    description: "Select or create a new crop",
    icon: <IconPlant />,
    Children: ({ onSubmit }: { onSubmit?: () => void }) => (
      <SelectCrop
        onSubmit={() => {
          if (onSubmit) onSubmit()
        }}
      />
    ),
  },
  {
    label: "date",
    description: "Select a date or a range",
    icon: <IconCalendarEvent />,
    Children: ({ onSubmit }: { onSubmit?: () => void }) => (
      <>
        <SelectDate
          onSubmit={() => {
            if (onSubmit) onSubmit()
          }}
        />
        <Button
          bg="dark.3"
          onClick={() => {
            if (onSubmit) onSubmit()
          }}
        >
          Next step
        </Button>
      </>
    ),
  },
  {
    label: "weight",
    description: "Enter the weight of the yield",
    icon: <IconScale />,
    Children: ({ onSubmit }: { onSubmit?: () => void }) => (
      <SelectWeight
        onSubmit={() => {
          if (onSubmit) onSubmit()
        }}
      />
    ),
  },
  {
    label: "area",
    description: "Enter the area of the yield",
    icon: <IconRulerMeasure />,
    Children: ({ onSubmit }: { onSubmit?: () => void }) => (
      <SelectArea
        onSubmit={() => {
          if (onSubmit) onSubmit()
        }}
      />
    ),
  },
]

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
    <StyledStepper
      active={active}
      onStepClick={setActive}
      size="xs"
      color="green.7"
    >
      {steps.map(({ label, description, Children, icon }, i) => (
        <Stepper.Step
          key={i}
          label={label}
          description={description}
          allowStepSelect={shouldAllowSelectStep(i)}
          icon={icon}
        >
          <Container>
            <Children
              onSubmit={() => {
                if (query && query[label]) nextStep()
              }}
            />
          </Container>
        </Stepper.Step>
      ))}
      <Stepper.Completed>
        <Container>
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
        </Container>
      </Stepper.Completed>
    </StyledStepper>
  )
}

export default Steps

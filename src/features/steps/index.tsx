import { FC, useCallback, useState } from "react"
import { Stepper, Button, Box } from "@mantine/core"
import dynamic from "next/dynamic"
import styled from "styled-components"
import { get } from "lodash"
import { ParsedUrlQuery } from "querystring"
import { useRouter } from "next/router"
import { useTasks } from "@/hooks/useTasks"

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
  .mantine-Stepper-stepIcon {
    transition: all 0.3s ease;
    color: ${({ theme }) => get(theme, "colors.gray[3]")};
    border-color: transparent;
    background-color: ${({ theme }) => get(theme, "colors.dark[1]")};
    border-width: 0;

    &[data-completed] {
      border-width: 0;
      background-color: ${({ theme }) => get(theme, "colors.dark[3]")};
    }
  }
  .mantine-Stepper-step {
    &[data-progress] {
      transform: scale(1.05);
    }
  }

  .mantine-Stepper-separator {
    transition: all 0.3s ease;
    background-color: ${({ theme }) => get(theme, "colors.dark[3]")};
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
    description: "Create or select a crop",
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
    description: "Select a date or a date range",
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
  const { createTask } = useTasks()

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
      createTask({
        title: query.crop,
        date: query.date,
        weight: query.weight,
        area: query.area,
      })
    }
  }, [active, createTask, query.area, query.date, query.crop, query.weight])

  const shouldAllowSelectStep = (step: number) =>
    highestStepVisited >= step && active !== step && active !== steps.length

  return (
    <>
      <StyledStepper active={active} onStepClick={setActive} size="xs">
        {steps.map(({ label, description, Children }, i) => (
          <Stepper.Step
            key={i}
            label={label}
            description={description}
            allowStepSelect={shouldAllowSelectStep(i)}
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
            <OverviewTable tasks={[query]} disableSelectRows />
            <Button component={"a"} href="/" bg="dark.3">
              Create New Entry
            </Button>
          </Container>
        </Stepper.Completed>
      </StyledStepper>
    </>
  )
}

export default Steps

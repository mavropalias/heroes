import Layout from "../components/Layout";
import theme from "../appTheme";
import {
  makeStyles,
  createStyles,
  Theme,
  Typography,
  Container,
  Grid,
  Paper,
  Avatar
} from "@material-ui/core";
import { Talk } from "../schema";
import Database from "../services/Database";
import { NextPage, NextPageContext } from "next";
import CuratedTalk from "../components/CuratedTalk";
import CATEGORIES from "../constants/categories";
import { useContext } from "react";
import { StackContext } from "../components/context-providers/StackContextProvider";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(8)
    },
    paper: {
      marginBottom: theme.spacing(4)
    },
    title: {
      background: `linear-gradient(35deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.dark} 100%)`,
      ["-webkit-background-clip"]: "text",
      ["background-clip"]: "text",
      ["text-fill-color"]: "transparent"
    }
  })
);

interface Props {
  talks: Talk[];
}

const CuratedPage: NextPage<Props> = ({ talks }) => {
  const { state: stateStack } = useContext(StackContext);
  const classes = useStyles({});

  let style = {
    background: `linear-gradient(35deg, ${theme.palette.background.paper} 0%, #444 100%)`
  };

  return (
    <Layout
      title="Curated React conference talks"
      description="Must-watch React talks from developer conferences around the world, hand-picked by our editorial team."
    >
      <Paper className={classes.paper} style={style} square>
        <Container className={classes.container}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={8}>
              <Typography variant="h1" className={classes.title}>
                Curated {stateStack.contextTitle} talks
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={1}>
                <Grid item>
                  <Avatar src="/kostas.png" />
                </Grid>
                <Grid item xs>
                  <Typography variant="body1">
                    I curate tech-talks from conferences around the world. I'm
                    looking for fascinating content and/or high educational
                    value, captivating delivery, and clear audio quality.
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    <em>Kostas, Hero35 Founder</em>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Paper>
      <Container>
        <Grid container spacing={4}>
          {talks.map(talk => (
            <Grid key={talk.id} item xs={12} sm={6} md={4}>
              <CuratedTalk talk={talk} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
};

interface QueryProps {
  stack: string;
}
CuratedPage.getInitialProps = async (ctx: NextPageContext) => {
  const { stack } = (ctx.query as unknown) as QueryProps;
  const stackid = stack ? CATEGORIES.find(cat => cat.slug === stack).id : null;
  const talks = await Database.getCuratedTalks(stackid);
  return { talks };
};

export default CuratedPage;

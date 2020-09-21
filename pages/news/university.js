import Head from 'next/head'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles({
  account: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    right: 0,
    marginRight: 20,
    height: 65,
  }
});

export default function Page() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Head>
        <title>University News - Atenews</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Typography variant="h3">Ateneans ‘mostly dissatisfied’ with tuition fees, survey shows</Typography>
      <Typography>
        Hello World
      </Typography>
      
    </div>
  )
}

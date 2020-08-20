import React from "react";
import MLAppBar from "../../components/NavBar";
import MLLogo from "./ml_logo/ml_logo";
import "cytoscape/dist/cytoscape.min";
import { projects } from "./project";
import Project from "./project";
import { Centered, OutlinedButtonLink } from "../../components/common";
import { Row, Col } from "react-bootstrap";
import urls from "../../data/urls.json";
import { Container } from "react-bootstrap";

export default class LandingPage extends React.Component {
  render() {
    return (
      <div className={"page"}>
        <Container>
          <MLAppBar />
          <MLLogo />
          <this.Desc />
          {projects.categories.map((category) => (
            <this.Category category={category} key={category.title} />
          ))}
          <Footer />
        </Container>
      </div>
    );
  }

  Desc() {
    return (
      <Centered>
        <div style={{ fontSize: 22, marginBottom: 70 }}>
          <p>
            Developed by{" "}
            <a className={"link"} href={urls.profile.url}>
              <b>
                <i>Akhilez</i>
              </b>
            </a>
          </p>
          <p>
            <b>Machine Learning Gallery</b> is a master project of few of my
            experiments with Neural Networks. It is designed in a way to help a
            beginner understand the concepts with visualizations. You can train
            and run the networks live and see the results for yourself. Every
            project here is followed by an explanation on how it works.
            <br />
            <br />
            Begin with a tour starting from the most basic Neural Network and
            build your way up.
          </p>
          <OutlinedButtonLink link={"/learn_line"} text={"Take a tour"} />
        </div>
      </Centered>
    );
  }

  Category(props) {
    let category = props.category;
    return (
      <div>
        <hr />
        <br />
        <h3 className={"ProjectCategoryTitle"}>{category.title}</h3>
        <Row>
          {category.projects.map((project) => (
            <Col sm="4" key={project.id}>
              <Project project={project} />
            </Col>
          ))}
        </Row>
        <br />
      </div>
    );
  }
}

function Footer() {
  return (
    <div>
      <br />
      <hr />
      <br />
      <Centered>ML Gallery</Centered>
      <br />
    </div>
  );
}
import React from "react";
import {Container} from "react-bootstrap";
import ProfileNavBar from "./navbar";
import {ProfileBadge, GithubCalendar, Social, ResumeButton} from './profile_components';
import toggle_img from './media/toggle.png';
import './css/timeline.css';
import code_art_img from './media/cover_code_art_with_bg_dark.png';
import neuralhack from './media/neuralhack.jpg';
import revolutionUC from './media/revolutionuc.jpg';
import projects from './data/projects';
import atheism_img from './media/evolution.jpg';
import vegan_img from './media/chicken.jpg';
import kmitra_img from './media/kmitraLogo.jpg';
import ezio_img from './media/ezio.jpg';


export default class ProfilePage extends React.Component {
    render() {
        return (
            <div className={"profile_root"}>
                <Container>
                    <ProfileNavBar active={"profile"}/>
                    <ProfileBadge/>
                    <this.Bio/>
                    <this.TimeLine/>
                    <this.CodingActivity/>
                    <this.Achievements/>
                    <this.Projects/>
                    <this.Misc/>
                    <this.Influencers/>
                    <this.Footer/>
                </Container>
            </div>
        );
    }

    Bio(props) {
        return (
            <div>
                <h3 className="header1">Bio</h3>
                <p className="para no_href_p">I am a Master’s student at <a href="https://www.uc.edu/">University of
                    Cincinnati</a> majoring in <a
                    href="https://webapps2.uc.edu/ecurriculum/degreeprograms/program/detail/20MAS-AI-MENG">Artificial
                    Intelligence</a>, specializing in Deep Learning architectures for Computer Vision, Reinforcement
                    Learning
                    and Complex Intelligent Systems. Previously, I was a full-stack engineer at an AI based startup
                    called <a href="https://www.aviso.com/">Aviso</a>, where I took the ownership of an internal web-app
                    that
                    manages
                    the cloud infrastructure. During my undergrad, I worked as a part-time Software Developer at the
                    college’s
                    administrative department where I developed software applications for digitalization and automation
                    of
                    the
                    administrative operations.</p>
                <p className="para no_href_p">In my spare time, I work on my own <a
                    href="http://akhilez.com/home/resume/">independent
                    projects</a>. I
                    developed a number of applications for the web and mobile over the years because I enjoy coding and
                    designing.
                    Lately, I’ve developed a deep interest in Artificial Intelligence and Space. Now, I associate my
                    goals
                    strongly
                    with pioneering the advancements in Artificial General Intelligence for further space exploration
                    and
                    more.</p>

                <div className="header1" style={{fontSize: 20, paddingTop: 20}}>
                    <img src={toggle_img} alt="toggle" height="30px"/>
                    &nbsp; Available for hire.
                </div>
            </div>
        );
    }

    TimeLine(props) {
        return (
            <div>
                <h3 className="header1">Timeline</h3>

                <div id="timeline_section">

                    <ul className="timeline no_href">
                        <li className="event" data-date="2019">
                            <h3 className={"timeline_heading"}><a
                                href="https://webapps2.uc.edu/ecurriculum/degreeprograms/program/detail/20MAS-AI-MENG">Master’s
                                in
                                Artificial Intelligence</a></h3>
                            <p><a href="https://www.uc.edu/">University of Cincinnati</a></p>
                            <p><a
                                href="https://webapps2.uc.edu/ecurriculum/degreeprograms/program/majormap/20MAS-AI-MENG">Courses
                                taken:</a> Intelligent Systems, ML, AI, Deep Learning, Complex Systems, Computer Vision,
                                StartupUC</p>
                        </li>
                        <li className="event" data-date="2018">
                            <h3 className={"timeline_heading"}>Full-Stack Engineer</h3>
                            <p><a href="https://www.aviso.com/">Aviso Inc.</a></p>
                            <p>Worked on a wide variety of tasks revolving around the cloud infrastructure of the Aviso
                                AI
                                product.</p>
                        </li>
                        <li className="event" data-date="2015">
                            <h3 className={"timeline_heading"}>Part-Time Developer</h3>
                            <p><a href="https://kmit.in/home">Keshav Memorial Institute of Technology</a></p>
                            <p>Developed apps for the college’s operations like <a
                                href="http://akhilez.com/home/all_projects//#student_feedback">Student
                                Feedback</a> and <a
                                href="http://akhilez.com/home/all_projects//#gatepass">Gate-Pass System</a></p>
                        </li>
                        <li className="event" data-date="2014">
                            <h3 className={"timeline_heading"}>Bachelor's in Computer Science and Engineering</h3>
                            <p><a href="https://kmit.in/home">Keshav Memorial Institute of Technology</a></p>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }

    CodingActivity(props) {
        return (
            <div>
                <h3 className="header1 no_href_p"><a target="_blank" href="https://github.com/Akhilez"
                                                     style={{fontWeight: 700}}>
                    Coding Activity</a></h3>

                <GithubCalendar/>

                <div className="row">
                    <img src={code_art_img} alt="CoverPhoto" width="400"/>
                </div>
            </div>
        );
    }

    Achievements(props) {
        return (
            <div>

                <h3 className="header1">Achievements</h3>

                <div className="row project_box">
                    <div className="col-md-7">
                        <img className="project_image" src={neuralhack} alt="syllabus"
                             width="600px"/>
                    </div>
                    <div className="col-md-5">
                        <h4 className="project_title">Won NeuralHack</h4>
                        <p className="project_description">NeuralHack is an India-wide hackathon with approximately
                            13,000
                            participants
                            conducted by Virtusa.
                            The tasks to be completed in 24 hours were:</p>
                        <ul className="project_description">
                            <li>
                                Build a machine learning model that predicts a class label from the given dataset.
                            </li>
                            <li>Build an IoT device that measures the alcohol content from the air and sends a signal to
                                the
                                cloud
                                on
                                reaching a threshold.
                            </li>
                        </ul>

                        <div className="row">
                            <div className="col-auto project_date">16th November, 2017</div>
                        </div>
                    </div>
                </div>

                <div className="row project_box">
                    <div className="col-md-7">
                        <img className="project_image" src={revolutionUC} alt="syllabus"
                             width="600px"/>
                    </div>
                    <div className="col-md-5">
                        <h4 className="project_title no_href">Won <a target="_blank"
                                                                     href="https://revolutionuc.com/">RevolutionUC</a>
                        </h4>
                        <p className="project_description no_href_p"><a
                            href="https://revolutionuc.com/">RevolutionUC</a> is
                            a
                            hackathon conducted by ACM at University of Cincinnati with roughly 400 participants.</p>
                        <p className="project_description no_href_p">I built an Augmented Reality game called <a
                            href="http://akhilez.com/home/all_projects//#alster">Alster</a> in 24 hours and won top
                            5.
                        </p>

                        <div className="row">
                            <div className="col-auto project_date">22nd February, 2020</div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }

    Projects(props) {
        return (
            <div>
                <h3 className="header1 no_href_p"><a href="https://github.com/Akhilez?tab=repositories"
                                                     style={{fontWeight: 700}}>
                    Independent Projects</a></h3>

                <div className="no_href">
                    {projects.projects.map(project =>
                        <div className="row project_box">
                            <div className="col-md-5">
                                <a target="_blank" href={project.links.app}>
                                    <img className="project_image"
                                         src={require('./media/projects/' + project.image)}
                                         alt={project.image}
                                         width="400px"/></a>
                            </div>
                            <div className="col-md-7">
                                <h4 className="project_title">
                                    <a target="_blank" href={project.links.app}>{project.title}</a></h4>
                                <div className={"projectLinkText"}>
                                    <a href={project.links.app} style={{color: "#919c9e", fontWeight: 400}}
                                       target={"_blank"}>{project.links.app}</a>
                                </div>
                                <p className="project_description">{project.desc}</p>

                                <div className="row">
                                    {project.tags.map(tag =>
                                        <div className="col-auto chip_tag">{tag}</div>
                                    )}
                                </div>

                                <div className="row">
                                    <div className="col-auto project_date">{project.date}</div>
                                    {project.links.code != null &&
                                    <div className="col-auto view_source_button" data-toggle="tooltip"
                                         title="View source code">
                                        <a target="_blank" href={project.links.code}>
                                            <i style={{fontSize: 24}} className="material-icons">code</i></a>
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                    )}
                    <a target="_blank" href="/profile/all_projects"
                       className="btn btn-outline-secondary btn-lg resume-button" style={{width: 200, marginTop: 30}}>SHOW
                        MORE</a>
                </div>
            </div>
        );
    }

    Misc(props) {
        return (
            <div>

                <h3 className="header1">Misc</h3>

                <div className="row project_box">
                    <div className="col-md-3">
                        <a target="_blank" href="http://kmit.in/emagazine/article/8934/">
                            <img className="project_image round-frame" src={kmitra_img} alt="kmitra"
                                 width="200px" height="200px"/></a>
                    </div>
                    <div className="col-md-9">
                        <h4 className="project_title no_href"><a target="_blank"
                                                                 href="http://kmit.in/emagazine/article/8934/">A
                            short
                            story on
                            AI</a></h4>
                        <p className="project_description no_href_p">In my undergrad, I was a monthly writer at the
                            college
                            e-magazine
                            called
                            <a target="_blank" href="http://kmit.in/emagazine/author/akhil-kanna/">kMITRA</a>. One of
                            the
                            articles I
                            wrote is an interesting short story on AI called
                            <a target="_blank" href="http://kmit.in/emagazine/article/8934/">“PrecArIous Love”</a>.</p>
                    </div>
                </div>

                <div className="row project_box">
                    <div className="col-md-3">
                        <img className="project_image round-frame" src={atheism_img} alt="evolution"
                             width="200px" height="200px"/>
                    </div>
                    <div className="col-md-9">
                        <h4 className="project_title no_href">Atheism &amp; Rational Thought</h4>
                        <p className="project_description no_href_p">I am an atheist. For me, atheism is not just
                            denying
                            God’s
                            existence. That is
                            easy. But I think atheism is an emergent phenomenon of rational thought. I encourage people
                            to
                            think
                            scientifically and make logical decisions rather than following a herd.</p>
                    </div>
                </div>

                <div className="row project_box">
                    <div className="col-md-3">
                        <img className="project_image round-frame" src={vegan_img} alt="chicken"
                             width="200px"
                             height="200px"/>
                    </div>
                    <div className="col-md-9">
                        <h4 className="project_title no_href">Being Vegan</h4>
                        <p className="project_description no_href_p">I love animals. I became a vegetarian when I was 10
                            after
                            witnessing an
                            animal slaughter for that night’s dinner. I believe no human has moral rights to kill
                            another
                            conscious
                            living thing unless it is life-threatening. Recently I stopped consuming all animal related
                            products
                            because it involves animal abuse to an unknown non-zero degree.</p>
                    </div>
                </div>

                <div className="row project_box">
                    <div className="col-md-3">
                        <img className="project_image round-frame" src={ezio_img} alt="ezio"
                             width="200px"
                             height="200px"/>
                    </div>
                    <div className="col-md-9">
                        <h4 className="project_title no_href">My Sketches</h4>
                        <p className="project_description no_href_p">I am very good at sketching. But I don’t find
                            enough
                            time
                            and
                            motivation to
                            do it often. I’ll soon post a gallery of my sketches.</p>
                    </div>
                </div>

            </div>
        );
    }

    Influencers(props) {
        return (
            <div className="project_box">
                <h5 className="project_title">Most influential people in my life</h5>
                <div className="inspiration_person_title no_href"><a target="_blank"
                                                                     href="https://twitter.com/elonmusk">Elon
                    Musk</a>
                    <div className="inspiration_person_description">"Work every waking hour."</div>
                </div>
                <div className="inspiration_person_title no_href"><a target="_blank"
                                                                     href="https://twitter.com/neiltyson">Neil
                    DeGrasse Tyson</a>
                    <div className="inspiration_person_description">"Science is true whether or not you believe in
                        it."
                    </div>
                </div>
                <div className="inspiration_person_title no_href"><a target="_blank"
                                                                     href="https://twitter.com/GrantCardone">Grant
                    Cardone</a>
                    <div className="inspiration_person_description">“Stay dangerous” from “Be obsessed or be
                        average”
                    </div>
                </div>
                <div className="inspiration_person_title no_href"><a target="_blank"
                                                                     href="https://twitter.com/RGVzoomin">Ram
                    Gopal
                    Varma</a>
                    <div className="inspiration_person_description">“Naa ishtam” (translation: I decide what I do.)
                    </div>
                </div>
                <div className="inspiration_person_title">
                    <div className="no_href"><a target="_blank" href="https://cs.stanford.edu/people/karpathy/">Andrej
                        Karpathy</a></div>
                    <div className="inspiration_person_description no_href_p">Andrej is very special to me. He was
                        just
                        a
                        normal <a target="_blank" href="https://www.youtube.com/user/badmephisto">youtuber</a> who
                        taught me rubik’s cube with his <a target="_blank"
                                                           href="https://www.youtube.com/user/badmephisto">videos</a>.
                        But he became very successful as I saw him grow older. Today he is the director of AI at
                        Tesla. My career path is a huge inspiration from his career path. Even this website is
                        lightly
                        inspired from his <a target="_blank"
                                             href="https://cs.stanford.edu/people/karpathy/">website.</a>
                    </div>
                </div>
                <div className="inspiration_person_title no_href"><a target="_blank"
                                                                     href="https://eecs.ceas.uc.edu/~aminai/">Ali
                    Minai</a>
                    <div className="inspiration_person_description">The most influential professor in my life. He is
                        the
                        reason why
                        I love academia so much.
                    </div>
                </div>
            </div>
        );
    }

    Footer(props) {
        return (
            <footer>
                <div className="footer">

                    <hr/>

                    <div style={{fontSize: 10, marginTop: 15}} className="roboto-light-ak no_href"><a
                        href="mailto:akhilkannadev@gmail.com">akhilkannadev@gmail.com</a></div>

                    <Social/>

                    <ResumeButton/>
                    <br/>

                    <p className="roboto-light-ak">Akhil Devarashetti</p>

                </div>
            </footer>
        );
    }

}

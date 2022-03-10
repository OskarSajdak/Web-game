package com.project.game;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class MainController {

    @Autowired
    private UserService service;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String getMainPage(Model model, User user) {
        return "index";
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public String registerNewUser (@ModelAttribute("user") User user, Model model) {
        service.save(user);
        return "index";
    }
}

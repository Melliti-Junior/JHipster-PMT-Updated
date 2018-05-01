package com.erp.app.web.rest;

import com.erp.app.DashBoardApp;

import com.erp.app.domain.Transition;
import com.erp.app.repository.TransitionRepository;
import com.erp.app.repository.search.TransitionSearchRepository;
import com.erp.app.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static com.erp.app.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the TransitionResource REST controller.
 *
 * @see TransitionResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DashBoardApp.class)
public class TransitionResourceIntTest {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private TransitionRepository transitionRepository;

    @Autowired
    private TransitionSearchRepository transitionSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restTransitionMockMvc;

    private Transition transition;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TransitionResource transitionResource = new TransitionResource(transitionRepository, transitionSearchRepository);
        this.restTransitionMockMvc = MockMvcBuilders.standaloneSetup(transitionResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Transition createEntity() {
        Transition transition = new Transition()
            .code(DEFAULT_CODE)
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION);
        return transition;
    }

    @Before
    public void initTest() {
        transitionRepository.deleteAll();
        transitionSearchRepository.deleteAll();
        transition = createEntity();
    }

    @Test
    public void createTransition() throws Exception {
        int databaseSizeBeforeCreate = transitionRepository.findAll().size();

        // Create the Transition
        restTransitionMockMvc.perform(post("/api/transitions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(transition)))
            .andExpect(status().isCreated());

        // Validate the Transition in the database
        List<Transition> transitionList = transitionRepository.findAll();
        assertThat(transitionList).hasSize(databaseSizeBeforeCreate + 1);
        Transition testTransition = transitionList.get(transitionList.size() - 1);
        assertThat(testTransition.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testTransition.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testTransition.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);

        // Validate the Transition in Elasticsearch
        Transition transitionEs = transitionSearchRepository.findOne(testTransition.getId());
        assertThat(transitionEs).isEqualToIgnoringGivenFields(testTransition);
    }

    @Test
    public void createTransitionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = transitionRepository.findAll().size();

        // Create the Transition with an existing ID
        transition.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restTransitionMockMvc.perform(post("/api/transitions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(transition)))
            .andExpect(status().isBadRequest());

        // Validate the Transition in the database
        List<Transition> transitionList = transitionRepository.findAll();
        assertThat(transitionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = transitionRepository.findAll().size();
        // set the field null
        transition.setCode(null);

        // Create the Transition, which fails.

        restTransitionMockMvc.perform(post("/api/transitions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(transition)))
            .andExpect(status().isBadRequest());

        List<Transition> transitionList = transitionRepository.findAll();
        assertThat(transitionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllTransitions() throws Exception {
        // Initialize the database
        transitionRepository.save(transition);

        // Get all the transitionList
        restTransitionMockMvc.perform(get("/api/transitions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(transition.getId())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    public void getTransition() throws Exception {
        // Initialize the database
        transitionRepository.save(transition);

        // Get the transition
        restTransitionMockMvc.perform(get("/api/transitions/{id}", transition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(transition.getId()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    public void getNonExistingTransition() throws Exception {
        // Get the transition
        restTransitionMockMvc.perform(get("/api/transitions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateTransition() throws Exception {
        // Initialize the database
        transitionRepository.save(transition);
        transitionSearchRepository.save(transition);
        int databaseSizeBeforeUpdate = transitionRepository.findAll().size();

        // Update the transition
        Transition updatedTransition = transitionRepository.findOne(transition.getId());
        updatedTransition
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION);

        restTransitionMockMvc.perform(put("/api/transitions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTransition)))
            .andExpect(status().isOk());

        // Validate the Transition in the database
        List<Transition> transitionList = transitionRepository.findAll();
        assertThat(transitionList).hasSize(databaseSizeBeforeUpdate);
        Transition testTransition = transitionList.get(transitionList.size() - 1);
        assertThat(testTransition.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testTransition.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testTransition.getDescription()).isEqualTo(UPDATED_DESCRIPTION);

        // Validate the Transition in Elasticsearch
        Transition transitionEs = transitionSearchRepository.findOne(testTransition.getId());
        assertThat(transitionEs).isEqualToIgnoringGivenFields(testTransition);
    }

    @Test
    public void updateNonExistingTransition() throws Exception {
        int databaseSizeBeforeUpdate = transitionRepository.findAll().size();

        // Create the Transition

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restTransitionMockMvc.perform(put("/api/transitions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(transition)))
            .andExpect(status().isCreated());

        // Validate the Transition in the database
        List<Transition> transitionList = transitionRepository.findAll();
        assertThat(transitionList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteTransition() throws Exception {
        // Initialize the database
        transitionRepository.save(transition);
        transitionSearchRepository.save(transition);
        int databaseSizeBeforeDelete = transitionRepository.findAll().size();

        // Get the transition
        restTransitionMockMvc.perform(delete("/api/transitions/{id}", transition.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean transitionExistsInEs = transitionSearchRepository.exists(transition.getId());
        assertThat(transitionExistsInEs).isFalse();

        // Validate the database is empty
        List<Transition> transitionList = transitionRepository.findAll();
        assertThat(transitionList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void searchTransition() throws Exception {
        // Initialize the database
        transitionRepository.save(transition);
        transitionSearchRepository.save(transition);

        // Search the transition
        restTransitionMockMvc.perform(get("/api/_search/transitions?query=id:" + transition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(transition.getId())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Transition.class);
        Transition transition1 = new Transition();
        transition1.setId("id1");
        Transition transition2 = new Transition();
        transition2.setId(transition1.getId());
        assertThat(transition1).isEqualTo(transition2);
        transition2.setId("id2");
        assertThat(transition1).isNotEqualTo(transition2);
        transition1.setId(null);
        assertThat(transition1).isNotEqualTo(transition2);
    }
}

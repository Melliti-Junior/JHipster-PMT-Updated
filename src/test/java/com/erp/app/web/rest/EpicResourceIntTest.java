package com.erp.app.web.rest;

import com.erp.app.DashBoardApp;

import com.erp.app.domain.Epic;
import com.erp.app.repository.EpicRepository;
import com.erp.app.repository.search.EpicSearchRepository;
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
 * Test class for the EpicResource REST controller.
 *
 * @see EpicResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DashBoardApp.class)
public class EpicResourceIntTest {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_SUMMARY = "AAAAAAAAAA";
    private static final String UPDATED_SUMMARY = "BBBBBBBBBB";

    @Autowired
    private EpicRepository epicRepository;

    @Autowired
    private EpicSearchRepository epicSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restEpicMockMvc;

    private Epic epic;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EpicResource epicResource = new EpicResource(epicRepository, epicSearchRepository);
        this.restEpicMockMvc = MockMvcBuilders.standaloneSetup(epicResource)
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
    public static Epic createEntity() {
        Epic epic = new Epic()
            .code(DEFAULT_CODE)
            .name(DEFAULT_NAME)
            .summary(DEFAULT_SUMMARY);
        return epic;
    }

    @Before
    public void initTest() {
        epicRepository.deleteAll();
        epicSearchRepository.deleteAll();
        epic = createEntity();
    }

    @Test
    public void createEpic() throws Exception {
        int databaseSizeBeforeCreate = epicRepository.findAll().size();

        // Create the Epic
        restEpicMockMvc.perform(post("/api/epics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(epic)))
            .andExpect(status().isCreated());

        // Validate the Epic in the database
        List<Epic> epicList = epicRepository.findAll();
        assertThat(epicList).hasSize(databaseSizeBeforeCreate + 1);
        Epic testEpic = epicList.get(epicList.size() - 1);
        assertThat(testEpic.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testEpic.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testEpic.getSummary()).isEqualTo(DEFAULT_SUMMARY);

        // Validate the Epic in Elasticsearch
        Epic epicEs = epicSearchRepository.findOne(testEpic.getId());
        assertThat(epicEs).isEqualToIgnoringGivenFields(testEpic);
    }

    @Test
    public void createEpicWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = epicRepository.findAll().size();

        // Create the Epic with an existing ID
        epic.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restEpicMockMvc.perform(post("/api/epics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(epic)))
            .andExpect(status().isBadRequest());

        // Validate the Epic in the database
        List<Epic> epicList = epicRepository.findAll();
        assertThat(epicList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = epicRepository.findAll().size();
        // set the field null
        epic.setCode(null);

        // Create the Epic, which fails.

        restEpicMockMvc.perform(post("/api/epics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(epic)))
            .andExpect(status().isBadRequest());

        List<Epic> epicList = epicRepository.findAll();
        assertThat(epicList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllEpics() throws Exception {
        // Initialize the database
        epicRepository.save(epic);

        // Get all the epicList
        restEpicMockMvc.perform(get("/api/epics?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(epic.getId())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].summary").value(hasItem(DEFAULT_SUMMARY.toString())));
    }

    @Test
    public void getEpic() throws Exception {
        // Initialize the database
        epicRepository.save(epic);

        // Get the epic
        restEpicMockMvc.perform(get("/api/epics/{id}", epic.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(epic.getId()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.summary").value(DEFAULT_SUMMARY.toString()));
    }

    @Test
    public void getNonExistingEpic() throws Exception {
        // Get the epic
        restEpicMockMvc.perform(get("/api/epics/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateEpic() throws Exception {
        // Initialize the database
        epicRepository.save(epic);
        epicSearchRepository.save(epic);
        int databaseSizeBeforeUpdate = epicRepository.findAll().size();

        // Update the epic
        Epic updatedEpic = epicRepository.findOne(epic.getId());
        updatedEpic
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .summary(UPDATED_SUMMARY);

        restEpicMockMvc.perform(put("/api/epics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEpic)))
            .andExpect(status().isOk());

        // Validate the Epic in the database
        List<Epic> epicList = epicRepository.findAll();
        assertThat(epicList).hasSize(databaseSizeBeforeUpdate);
        Epic testEpic = epicList.get(epicList.size() - 1);
        assertThat(testEpic.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testEpic.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEpic.getSummary()).isEqualTo(UPDATED_SUMMARY);

        // Validate the Epic in Elasticsearch
        Epic epicEs = epicSearchRepository.findOne(testEpic.getId());
        assertThat(epicEs).isEqualToIgnoringGivenFields(testEpic);
    }

    @Test
    public void updateNonExistingEpic() throws Exception {
        int databaseSizeBeforeUpdate = epicRepository.findAll().size();

        // Create the Epic

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restEpicMockMvc.perform(put("/api/epics")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(epic)))
            .andExpect(status().isCreated());

        // Validate the Epic in the database
        List<Epic> epicList = epicRepository.findAll();
        assertThat(epicList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteEpic() throws Exception {
        // Initialize the database
        epicRepository.save(epic);
        epicSearchRepository.save(epic);
        int databaseSizeBeforeDelete = epicRepository.findAll().size();

        // Get the epic
        restEpicMockMvc.perform(delete("/api/epics/{id}", epic.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean epicExistsInEs = epicSearchRepository.exists(epic.getId());
        assertThat(epicExistsInEs).isFalse();

        // Validate the database is empty
        List<Epic> epicList = epicRepository.findAll();
        assertThat(epicList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void searchEpic() throws Exception {
        // Initialize the database
        epicRepository.save(epic);
        epicSearchRepository.save(epic);

        // Search the epic
        restEpicMockMvc.perform(get("/api/_search/epics?query=id:" + epic.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(epic.getId())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].summary").value(hasItem(DEFAULT_SUMMARY.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Epic.class);
        Epic epic1 = new Epic();
        epic1.setId("id1");
        Epic epic2 = new Epic();
        epic2.setId(epic1.getId());
        assertThat(epic1).isEqualTo(epic2);
        epic2.setId("id2");
        assertThat(epic1).isNotEqualTo(epic2);
        epic1.setId(null);
        assertThat(epic1).isNotEqualTo(epic2);
    }
}
